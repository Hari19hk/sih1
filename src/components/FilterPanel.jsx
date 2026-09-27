import React, { useState } from 'react';
import { Filter, Search, Building2, Layers, RotateCcw, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { CLASSIFICATIONS, PRESET_HOTSPOTS } from '../data/categories';

const CLASS_ICONS = {
  industrial_fire: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2.03v2.02c4.39.54 7.5 4.53 6.96 8.92-.46 3.64-3.32 6.53-6.96 7.02v2.02c5.5-.55 9.5-5.29 8.95-10.79C21.44 6.61 17.65 2.51 13 2.03M11 2.06C9.05 2.25 7.19 3 5.67 4.26L7.1 5.74C8.22 4.84 9.57 4.26 11 4.06v-2M4.26 5.67C3 7.19 2.25 9.05 2.06 11h2c.19-1.42.75-2.77 1.68-3.9L4.26 5.67M2.06 13c.2 1.96.97 3.81 2.21 5.33l1.42-1.43C4.84 15.77 4.26 14.42 4.06 13h-2m5.02 5.71c-1.26-1.52-2.01-3.37-2.21-5.33 0 0 0-.01 0-.01h-2c.2 1.96.97 3.81 2.21 5.33L7.1 19.74m4.9.26v-2c-1.42-.2-2.77-.75-3.9-1.68L6.67 17.74C8.19 19 10.05 19.75 12 19.94v.06" />
    </svg>
  ),
  gas_flare: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2v6l2 2-2 2v2l2-2 2 2V8.83L8.83 7 10 5.83V2H6m4 0v3.17L8.83 6.5 10 7.17V8l2-2-2-2V2h-4m8 10c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4m-4-6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
    </svg>
  ),
  forest_fire: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.54L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 4-2 8-2s4 2 8 2v-2c-4 0-4-2-8-2-1.13 0-1.9.16-2.53.33C14.28 11.06 17 8.31 17 8z" />
    </svg>
  ),
  agricultural_burn: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8.5L15 6.5c-1.4-1.4-3.2-2.1-5-2.1s-3.6.7-4.9 2.1C3.7 7.9 3 9.7 3 11.5c0 3.9 3.1 7 7 7s7-3.1 7-7c0-1.1-.3-2.1-.8-3h.8c1.4 0 2.5-1.1 2.5-2.5S18.4 3.5 17 3.5h-4v2h4c.3 0 .5.2.5.5s-.2.5-.5.5H17z" />
    </svg>
  ),
  mining_activity: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.08 5.12L3 6.2l4.08 4.07 1.41-1.41-4.41-3.74m17.6 9.65l-1.4-1.41-4.09 4.09 1.41 1.41 4.08-4.09m-7.55-7.5l-.74-.74A3.94 3.94 0 0 0 11 6c-.75 0-1.45.21-2.05.57l6.89 6.89A3.96 3.96 0 0 0 15 11a3.9 3.9 0 0 0-.87-2.73M2 16.27l.01 3.73L6 20v-3.72L2 16.27M10 7.27V14c0 .56.21 1.07.56 1.46l.74.74.7-.7V7.27l-1-.72-1 .72" />
    </svg>
  ),
};

const SectionHeader = ({ label }) => (
  <div className="section-rule" style={{ padding: '14px 12px 6px' }}>
    <span className="text-label">{label}</span>
  </div>
);

export default function FilterPanel({
  filters, setFilters, classCounts,
  onFlyTo, onResetFilters,
  isCollapsed, setIsCollapsed,
  layersState, setLayersState,
}) {
  const toggleClass = (id) => {
    setFilters(prev => {
      const s = prev.selectedClasses;
      return { ...prev, selectedClasses: s.includes(id) ? s.filter(c => c !== id) : [...s, id] };
    });
  };

  return (
    <aside
      style={{
        width: isCollapsed ? 44 : 272,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      {/* Panel header */}
      <div
        style={{
          height: 44,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? 0 : '0 12px',
          flexShrink: 0,
        }}
      >
        {!isCollapsed && (
          <span className="text-label">Intelligence Filters</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 5,
            border: '1px solid var(--border)',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
          title={isCollapsed ? 'Expand filters' : 'Collapse filters'}
        >
          {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* Collapsed — icon column */}
      {isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 16 }}>
          {Object.values(CLASSIFICATIONS).map(cat => (
            <div
              key={cat.id}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: filters.selectedClasses.includes(cat.id) ? cat.color : 'var(--surface-3)',
                cursor: 'pointer',
              }}
              onClick={() => toggleClass(cat.id)}
              title={cat.shortLabel}
            />
          ))}
        </div>
      )}

      {/* Expanded content */}
      {!isCollapsed && (
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          {/* Search */}
          <div style={{ padding: '10px 12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Event ID, facility, land cover…"
                value={filters.searchQuery}
                onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '7px 9px 7px 28px',
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  borderRadius: 5,
                  color: 'var(--text-primary)',
                  fontSize: 12,
                  fontFamily: 'Inter',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
          </div>

          {/* Classification rows */}
          <SectionHeader label="Thermal Classification" />
          <div style={{ borderTop: '1px solid var(--border)' }}>
            {Object.values(CLASSIFICATIONS).map(cat => {
              const active = filters.selectedClasses.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  className={`class-row ${!active ? 'inactive' : ''}`}
                  onClick={() => toggleClass(cat.id)}
                  style={{ '--row-color': cat.color }}
                >
                  {/* Left color accent */}
                  <div
                    style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                      borderRadius: '0 2px 2px 0',
                      background: active ? cat.color : 'transparent',
                      transition: 'background 0.15s',
                    }}
                  />

                  {/* Dot */}
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />

                  {/* Icon */}
                  <span style={{ color: active ? cat.color : 'var(--text-muted)', flexShrink: 0, opacity: active ? 1 : 0.5 }}>
                    {CLASS_ICONS[cat.id]}
                  </span>

                  {/* Label */}
                  <span style={{ fontSize: 12, fontWeight: 500, color: active ? 'var(--text-primary)' : 'var(--text-secondary)', flex: 1, lineHeight: 1.3 }}>
                    {cat.shortLabel}
                  </span>

                  {/* Count */}
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                    {(classCounts[cat.id] || 0).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* FRP slider */}
          <SectionHeader label="Min Fire Radiative Power" />
          <div style={{ padding: '4px 12px 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Threshold</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: '#EF4444' }}>
                {filters.minFrp} <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}>MW</span>
              </span>
            </div>
            <input
              type="range" min="0" max="100" step="5"
              className="custom-slider"
              value={filters.minFrp}
              onChange={e => setFilters(prev => ({ ...prev, minFrp: Number(e.target.value) }))}
              style={{
                background: `linear-gradient(to right, #EF4444 ${filters.minFrp}%, var(--surface-3) ${filters.minFrp}%)`,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
              <span>0</span><span>50</span><span>100+</span>
            </div>
          </div>

          {/* Proximity */}
          <SectionHeader label="Industrial Proximity" />
          <div style={{ padding: '4px 12px 8px', display: 'flex', gap: 4 }}>
            {[{ id: 'all', label: 'Any' }, { id: '5km', label: '≤ 5 km' }, { id: '1km', label: '≤ 1 km' }].map(opt => {
              const active = filters.proximityFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFilters(prev => ({ ...prev, proximityFilter: opt.id }))}
                  style={{
                    flex: 1, padding: '5px 4px',
                    borderRadius: 4,
                    fontSize: 11, fontWeight: 600,
                    cursor: 'pointer',
                    border: `1px solid ${active ? 'rgba(6,182,212,0.4)' : 'var(--border)'}`,
                    background: active ? 'rgba(6,182,212,0.1)' : 'transparent',
                    color: active ? '#06B6D4' : 'var(--text-muted)',
                    transition: 'all 0.15s',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Layers */}
          <SectionHeader label="Map Layers" />
          <div style={{ padding: '0 0 8px' }}>
            {[
              { key: 'showPoints', label: 'Classified Point Cloud', color: '#EF4444' },
              { key: 'showHeatmap', label: 'FRP Heatmap Density', color: '#F97316' },
              { key: 'showHexagons', label: 'Hexagonal Aggregation 3D', color: '#06B6D4' },
              { key: 'showBuffers', label: 'Infrastructure Buffers', color: '#6366F1' },
            ].map(layer => {
              const on = layersState[layer.key];
              return (
                <div
                  key={layer.key}
                  className="class-row"
                  onClick={() => setLayersState(p => ({ ...p, [layer.key]: !p[layer.key] }))}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                    borderRadius: '0 2px 2px 0', background: on ? layer.color : 'transparent',
                  }} />

                  {/* Toggle indicator */}
                  <div style={{
                    width: 28, height: 15, borderRadius: 8,
                    background: on ? layer.color : 'var(--surface-3)',
                    border: `1px solid ${on ? layer.color : 'var(--border-strong)'}`,
                    position: 'relative', transition: 'all 0.2s', flexShrink: 0,
                  }}>
                    <div style={{
                      position: 'absolute', top: 2,
                      left: on ? 14 : 2,
                      width: 9, height: 9, borderRadius: '50%',
                      background: on ? 'white' : 'var(--text-muted)',
                      transition: 'left 0.2s',
                    }} />
                  </div>

                  <span style={{ fontSize: 12, fontWeight: 500, color: on ? 'var(--text-primary)' : 'var(--text-secondary)', flex: 1 }}>
                    {layer.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Preset hotspots */}
          <SectionHeader label="Industrial Hotspot Hubs" />
          <div style={{ padding: '2px 0 8px' }}>
            {PRESET_HOTSPOTS.map((preset, i) => (
              <button
                key={i}
                onClick={() => onFlyTo(preset.lat, preset.lon, preset.zoom)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '8px 12px',
                  fontSize: 12, fontWeight: 500,
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <MapPin size={11} color="#EF4444" style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, lineHeight: 1.3 }}>{preset.name}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                  ↗
                </span>
              </button>
            ))}
          </div>

          {/* Reset */}
          <div style={{ padding: '8px 12px' }}>
            <button
              onClick={onResetFilters}
              style={{
                width: '100%', padding: '7px',
                borderRadius: 5, fontSize: 11, fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <RotateCcw size={11} />
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
