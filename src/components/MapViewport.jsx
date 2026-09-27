import React, { useState, useEffect, useRef, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';
import maplibregl from 'maplibre-gl';
import { CLASSIFICATIONS, BASEMAPS } from '../data/categories';
import { 
  ZoomIn, 
  ZoomOut, 
  Rotate3d,
} from 'lucide-react';

const INITIAL_VIEW_STATE = {
  longitude: 78.9629,
  latitude: 20.5937,
  zoom: 4.8,
  minZoom: 3,
  maxZoom: 18,
  pitch: 30,
  bearing: 0
};

export default function MapViewport({
  events,
  selectedEvent,
  onSelectEvent,
  activeBasemap,
  layersState,
  viewState,
  setViewState
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  // Initialize MapLibre GL base map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const bmConfig = BASEMAPS.find(b => b.id === activeBasemap) || BASEMAPS[0];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: bmConfig.style,
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing,
      interactive: false, // Deck.gl handles interactions
      attributionControl: false
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Prevent browser-level page zoom when pinching on trackpads or mobile gestures
  useEffect(() => {
    const handleWheel = (e) => {
      // ctrlKey is set when user pinches on macOS trackpads
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    const handleGesture = (e) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('gesturestart', handleGesture, { passive: false });
    window.addEventListener('gesturechange', handleGesture, { passive: false });
    window.addEventListener('gestureend', handleGesture, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('gesturestart', handleGesture);
      window.removeEventListener('gesturechange', handleGesture);
      window.removeEventListener('gestureend', handleGesture);
    };
  }, []);

  // Update map style when basemap changes
  useEffect(() => {
    if (!mapRef.current) return;
    const bmConfig = BASEMAPS.find(b => b.id === activeBasemap) || BASEMAPS[0];
    mapRef.current.setStyle(bmConfig.style);
  }, [activeBasemap]);

  // Synchronize MapLibre camera with Deck.gl view state & clear transition latency
  const handleViewStateChange = ({ viewState: newViewState, interactionState }) => {
    const sanitized = {
      ...newViewState,
      // Clear transition duration on direct user manipulation so pinch/zoom/pan is instantaneous
      transitionDuration: 0,
      minZoom: 3,
      maxZoom: 18
    };

    setViewState(sanitized);
    if (mapRef.current) {
      mapRef.current.jumpTo({
        center: [sanitized.longitude, sanitized.latitude],
        zoom: sanitized.zoom,
        pitch: sanitized.pitch,
        bearing: sanitized.bearing
      });
    }
  };

  // Build GPU Deck.gl Layers
  const layers = useMemo(() => {
    const list = [];

    // 1. Heatmap Layer for Fire Radiative Power (FRP) Intensity
    if (layersState.showHeatmap && events.length > 0) {
      list.push(
        new HeatmapLayer({
          id: 'frp-heatmap-layer',
          data: events,
          getPosition: d => [d.lon, d.lat],
          getWeight: d => Math.max(d.frp_max, 1),
          radiusPixels: 45,
          intensity: 1.5,
          threshold: 0.05,
          aggregation: 'SUM'
        })
      );
    }

    // 2. 3D Hexagon Aggregation Layer
    if (layersState.showHexagons && events.length > 0) {
      list.push(
        new HexagonLayer({
          id: 'hexagon-energy-layer',
          data: events,
          getPosition: d => [d.lon, d.lat],
          radius: 12000,
          elevationScale: 100,
          extruded: true,
          pickable: true,
          getElevationValue: points => points.reduce((sum, p) => sum + p.frp_max, 0),
          getColorValue: points => points.reduce((sum, p) => sum + p.frp_mean, 0) / points.length,
          colorRange: [
            [254, 240, 138, 180],
            [253, 186, 116, 200],
            [251, 146, 60, 220],
            [239, 68, 68, 230],
            [185, 28, 28, 240],
            [127, 29, 29, 250]
          ],
          opacity: 0.75
        })
      );
    }

    // 3. OSM Facility Buffer Rings for Selected Event
    if (layersState.showBuffers && selectedEvent) {
      // 1km inner safety buffer & 5km outer buffer
      list.push(
        new ScatterplotLayer({
          id: 'facility-buffer-5km',
          data: [selectedEvent],
          getPosition: d => [d.lon, d.lat],
          getRadius: 5000,
          stroked: true,
          filled: true,
          getFillColor: [99, 102, 241, 20],
          getLineColor: [99, 102, 241, 140],
          getLineWidth: 2,
          lineWidthUnits: 'pixels'
        }),
        new ScatterplotLayer({
          id: 'facility-buffer-1km',
          data: [selectedEvent],
          getPosition: d => [d.lon, d.lat],
          getRadius: 1000,
          stroked: true,
          filled: true,
          getFillColor: [239, 68, 68, 40],
          getLineColor: [239, 68, 68, 220],
          getLineWidth: 2,
          lineWidthUnits: 'pixels'
        })
      );
    }

    // 4. Primary Classified Thermal Points Cloud
    if (layersState.showPoints && events.length > 0) {
      list.push(
        new ScatterplotLayer({
          id: 'thermal-points-layer',
          data: events,
          pickable: true,
          opacity: 0.9,
          stroked: true,
          filled: true,
          radiusScale: 1,
          radiusMinPixels: 4.5,
          radiusMaxPixels: 24,
          lineWidthMinPixels: 1,
          getPosition: d => [d.lon, d.lat],
          getRadius: d => Math.max(300, Math.min(d.frp_max * 70, 6000)),
          getFillColor: d => {
            const cat = CLASSIFICATIONS[d.classification];
            return cat ? [...cat.rgb, d.classification === 'industrial_fire' ? 240 : 200] : [255, 255, 255, 200];
          },
          getLineColor: d => {
            if (selectedEvent && selectedEvent.id === d.id) {
              return [255, 255, 255, 255];
            }
            return d.classification === 'industrial_fire' ? [255, 200, 200, 220] : [0, 0, 0, 160];
          },
          getLineWidth: d => (selectedEvent && selectedEvent.id === d.id ? 3 : 1),
          updateTriggers: {
            getLineColor: [selectedEvent],
            getLineWidth: [selectedEvent]
          }
        })
      );
    }

    // 5. Selected Event Pulsing Ring / Crosshair Marker
    if (selectedEvent) {
      list.push(
        new ScatterplotLayer({
          id: 'selected-highlight-outer',
          data: [selectedEvent],
          getPosition: d => [d.lon, d.lat],
          getRadius: 1800,
          stroked: true,
          filled: false,
          getLineColor: [255, 255, 255, 230],
          getLineWidth: 2.5,
          lineWidthUnits: 'pixels'
        }),
        new ScatterplotLayer({
          id: 'selected-highlight-center',
          data: [selectedEvent],
          getPosition: d => [d.lon, d.lat],
          getRadius: 400,
          stroked: true,
          filled: true,
          getFillColor: [255, 255, 255, 240],
          getLineColor: [239, 68, 68, 255],
          getLineWidth: 3,
          lineWidthUnits: 'pixels'
        })
      );
    }

    return list;
  }, [events, selectedEvent, layersState]);

  // Camera Controls
  const handleZoomIn = () => {
    setViewState(prev => {
      const next = { ...prev, zoom: Math.min(prev.zoom + 1, 18) };
      handleViewStateChange({ viewState: next });
      return next;
    });
  };

  const handleZoomOut = () => {
    setViewState(prev => {
      const next = { ...prev, zoom: Math.max(prev.zoom - 1, 3) };
      handleViewStateChange({ viewState: next });
      return next;
    });
  };

  const handleResetPitch = () => {
    setViewState(prev => {
      const next = { ...prev, pitch: prev.pitch === 0 ? 45 : 0, bearing: 0 };
      handleViewStateChange({ viewState: next });
      return next;
    });
  };

  return (
    <div className="relative flex-1 h-full w-full overflow-hidden bg-space-950" style={{ touchAction: 'none' }}>
      {/* MapLibre Map Canvas */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Deck.gl WebGL Canvas */}
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        controller={{
          dragPan: true,
          dragRotate: true,
          scrollZoom: {
            smooth: true,
            speed: 0.015
          },
          touchZoom: true,
          touchRotate: true,
          doubleClickZoom: true,
          keyboard: true,
          inertia: 200
        }}
        style={{ touchAction: 'none', position: 'absolute', inset: 0 }}
        layers={layers}
        getCursor={({ isHovering, isDragging }) => (isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab')}
        onClick={({ object }) => {
          if (object && object.id) {
            onSelectEvent(object);
          }
        }}
        onHover={({ object, x, y }) => {
          if (object && object.id) {
            setHoverInfo({ object, x, y });
          } else {
            setHoverInfo(null);
          }
        }}
      />

      {/* Floating Map Navigation Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl">
        <button
          onClick={handleZoomIn}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-px bg-slate-800 my-0.5" />
        <button
          onClick={handleResetPitch}
          className={`p-2 rounded-lg transition-colors ${
            viewState.pitch > 0 ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle 3D Pitch"
        >
          <Rotate3d className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend — clean minimal strip */}
      <div
        style={{
          position: 'absolute', bottom: 16, left: 16, zIndex: 20,
          background: 'rgba(17,17,21,0.92)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 6,
          padding: '8px 12px',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7 }}>
          AI Classification
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {Object.values(CLASSIFICATIONS).map((cat) => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 3, height: 12, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(250,250,250,0.75)' }}>
                {cat.shortLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover Tooltip — Bloomberg terminal style */}
      {hoverInfo && (
        <div
          style={{
            position: 'absolute',
            left: hoverInfo.x,
            top: hoverInfo.y,
            transform: 'translate(-50%, calc(-100% - 10px))',
            zIndex: 30,
            pointerEvents: 'none',
            background: 'rgba(17,17,21,0.97)',
            border: `1px solid ${CLASSIFICATIONS[hoverInfo.object.classification]?.color}44`,
            borderRadius: 6,
            padding: '8px 12px',
            minWidth: 200,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          {/* Classification band at top */}
          <div style={{
            height: 2, borderRadius: '4px 4px 0 0',
            background: CLASSIFICATIONS[hoverInfo.object.classification]?.color,
            margin: '-8px -12px 7px -12px',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: CLASSIFICATIONS[hoverInfo.object.classification]?.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
              {CLASSIFICATIONS[hoverInfo.object.classification]?.shortLabel}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>
              #{hoverInfo.object.id}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: 10 }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 1 }}>Peak FRP</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#EF4444' }}>{hoverInfo.object.frp_max} MW</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 1 }}>AI Match</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#10B981' }}>{hoverInfo.object.confidence}%</div>
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: 2, paddingTop: 5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: 1 }}>Nearest facility</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>
                {hoverInfo.object.nearest_facility} · {hoverInfo.object.dist_nearest_km} km
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
