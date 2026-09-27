import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import MapViewport from './components/MapViewport';
import EventInspector from './components/EventInspector';
import TimePlaybackScrubber from './components/TimePlaybackScrubber';
import AnalyticsModal from './components/AnalyticsModal';
import LiveAlertToast from './components/LiveAlertToast';
import rawEvents from './data/events.json';
import { CLASSIFICATIONS } from './data/categories';

export default function App() {
  // All thermal events from data
  const allEvents = useMemo(() => rawEvents || [], []);

  // Filter States
  const [filters, setFilters] = useState({
    selectedClasses: Object.keys(CLASSIFICATIONS),
    minFrp: 0,
    proximityFilter: 'all', // 'all', '5km', '1km'
    searchQuery: ''
  });

  // Layer States
  const [layersState, setLayersState] = useState({
    showPoints: true,
    showHeatmap: false,
    showHexagons: false,
    showBuffers: true
  });

  // Basemap & Viewport State
  const [activeBasemap, setActiveBasemap] = useState('dark');
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 21.5937,
    zoom: 4.8,
    minZoom: 3,
    maxZoom: 18,
    pitch: 25,
    bearing: 0
  });

  // UI Panels State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Time playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  // Unique chronological dates list
  const allDates = useMemo(() => {
    const dates = Array.from(new Set(allEvents.map((e) => e.start_date))).sort();
    return dates.length > 0 ? dates : ['2024-05-01'];
  }, [allEvents]);

  // Date counts for temporal histogram
  const dateCounts = useMemo(() => {
    const counts = {};
    allEvents.forEach((e) => {
      counts[e.start_date] = (counts[e.start_date] || 0) + 1;
    });
    return counts;
  }, [allEvents]);

  // Active Date under playback
  const activeDate = allDates[currentDateIndex] || allDates[0];

  // Filtering Pipeline
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      // 1. Classification Match
      if (!filters.selectedClasses.includes(event.classification)) return false;

      // 2. Minimum FRP Match
      if (event.frp_max < filters.minFrp) return false;

      // 3. Proximity Filter Match
      if (filters.proximityFilter === '1km' && event.dist_nearest_km > 1) return false;
      if (filters.proximityFilter === '5km' && event.dist_nearest_km > 5) return false;

      // 4. Search Query Match
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesId = String(event.id).includes(query);
        const matchesFacility = event.nearest_facility.toLowerCase().includes(query);
        const matchesLandcover = event.landcover.toLowerCase().includes(query);
        if (!matchesId && !matchesFacility && !matchesLandcover) return false;
      }

      // 5. Playback filter (if playback is active, show events on or before activeDate)
      if (isPlaying) {
        if (event.start_date !== activeDate) return false;
      }

      return true;
    });
  }, [allEvents, filters, isPlaying, activeDate]);

  // Class Counts for Badges
  const classCounts = useMemo(() => {
    const counts = {};
    Object.keys(CLASSIFICATIONS).forEach(k => counts[k] = 0);
    allEvents.forEach(e => {
      if (counts[e.classification] !== undefined) {
        counts[e.classification]++;
      }
    });
    return counts;
  }, [allEvents]);

  // High Risk Critical Count
  const highRiskCount = useMemo(() => {
    return allEvents.filter(e => e.classification === 'industrial_fire' && e.frp_max > 30).length;
  }, [allEvents]);

  // Fly to location helper
  const handleFlyTo = useCallback((lat, lon, zoom = 12) => {
    setViewState(prev => ({
      ...prev,
      latitude: lat,
      longitude: lon,
      zoom: zoom,
      pitch: 35,
      transitionDuration: 1200
    }));
  }, []);

  // Reset Filters
  const handleResetFilters = useCallback(() => {
    setFilters({
      selectedClasses: Object.keys(CLASSIFICATIONS),
      minFrp: 0,
      proximityFilter: 'all',
      searchQuery: ''
    });
  }, []);

  // Reset Camera View
  const handleResetView = useCallback(() => {
    setViewState({
      longitude: 78.9629,
      latitude: 21.5937,
      zoom: 4.8,
      minZoom: 3,
      maxZoom: 18,
      pitch: 25,
      bearing: 0
    });
  }, []);

  // Export Filtered Dataset as GeoJSON
  const handleExportGeoJSON = useCallback(() => {
    const geojson = {
      type: 'FeatureCollection',
      features: filteredEvents.map(e => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [e.lon, e.lat]
        },
        properties: e
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aerothermal_classified_events_${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredEvents]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-space-950 font-sans select-none">
      {/* 1. Command Header */}
      <Header
        totalEvents={allEvents.length}
        filteredEventsCount={filteredEvents.length}
        highRiskCount={highRiskCount}
        activeBasemap={activeBasemap}
        setActiveBasemap={setActiveBasemap}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onExportGeoJSON={handleExportGeoJSON}
        onResetView={handleResetView}
      />

      {/* 2. Main Geospatial Workspace */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Filter Panel */}
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          classCounts={classCounts}
          onFlyTo={handleFlyTo}
          onResetFilters={handleResetFilters}
          isCollapsed={isFilterCollapsed}
          setIsCollapsed={setIsFilterCollapsed}
          layersState={layersState}
          setLayersState={setLayersState}
        />

        {/* Central Map Canvas */}
        <MapViewport
          events={filteredEvents}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
          activeBasemap={activeBasemap}
          layersState={layersState}
          viewState={viewState}
          setViewState={setViewState}
        />

        {/* Right Event Inspector Drawer */}
        {selectedEvent && (
          <EventInspector
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onFlyTo={handleFlyTo}
          />
        )}
      </div>

      {/* 3. Bottom Temporal Playback Scrubber */}
      <TimePlaybackScrubber
        allDates={allDates}
        currentDateIndex={currentDateIndex}
        setCurrentDateIndex={setCurrentDateIndex}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        dateCounts={dateCounts}
      />

      {/* 4. Live Simulated Satellite Alert Toasts */}
      <LiveAlertToast
        events={allEvents}
        onSelectEvent={setSelectedEvent}
        onFlyTo={handleFlyTo}
      />

      {/* 5. Comprehensive Analytics Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        events={filteredEvents}
      />
    </div>
  );
}
