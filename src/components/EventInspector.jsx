import React, { useEffect, useRef } from 'react';
import { X, Download, Eye, MapPin, Calendar, Layers } from 'lucide-react';
import { CLASSIFICATIONS } from '../data/categories';

/* Animated SVG arc confidence meter */
function ConfidenceArc({ value, color }) {
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value / 100);

  return (
    <div style={{ position: 'relative', width: 88, height: 88, flexShrink: 0 }}>
      <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx="44" cy="44" r={r}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth="5"
        />
        {/* Arc */}
        <circle
          cx="44" cy="44" r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)', opacity: 0.9 }}
        />
      </svg>
      {/* Center value */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 0,
      }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 700, color: color, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {value}
        </span>
        <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          %
        </span>
      </div>
    </div>
  );
}

/* Telemetry row */
function TelemRow({ label, value, valueColor, unit }) {
  return (
    <div className="telem-row">
      <span className="telem-label">{label}</span>
      <span className="telem-value" style={{ color: valueColor || 'var(--text-primary)' }}>
        {value}
        {unit && <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 3 }}>{unit}</span>}
      </span>
    </div>
  );
}

/* Section header */
function SectionHeader({ label, icon }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      padding: '14px 0 6px',
      borderBottom: '1px solid var(--border)',
      marginBottom: 0,
    }}>
      {icon && <span style={{ color: 'var(--text-muted)' }}>{icon}</span>}
      <span className="text-label">{label}</span>
    </div>
  );
}

/* Distance bar — concentric radii visualization */
function DistanceBar({ label, km, maxKm = 50 }) {
  const pct = Math.min((km / maxKm) * 100, 100);
  const color = km <= 1 ? '#EF4444' : km <= 5 ? '#F97316' : km <= 10 ? '#F59E0B' : 'var(--text-muted)';
  const displayKm = km > 100 ? '>100' : km.toFixed(1);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
      <span style={{ fontSize: 11, color: 'var(--text-secondary)', width: 80, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 3, background: 'var(--surface-3)', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: color, borderRadius: 2, opacity: 0.7 }} />
      </div>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color, width: 38, textAlign: 'right', flexShrink: 0 }}>
        {displayKm} km
      </span>
    </div>
  );
}

export default function EventInspector({ event, onClose, onFlyTo }) {
  if (!event) return null;

  const cat = CLASSIFICATIONS[event.classification] || CLASSIFICATIONS.industrial_fire;

  const severityColors = {
    Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#10B981'
  };

  const downloadGeoJSON = () => {
    const blob = new Blob([JSON.stringify({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [event.lon, event.lat] },
      properties: event,
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `event_${event.id}.geojson`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside
      className="animate-fade-up"
      style={{
        width: 320,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-1)',
        borderLeft: '1px solid var(--border)',
        flexShrink: 0,
        zIndex: 20,
        overflow: 'hidden',
      }}
    >
      {/* Top classification band */}
      <div style={{
        height: 4,
        background: cat.color,
        flexShrink: 0,
      }} />

      {/* Header row */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexShrink: 0,
        gap: 8,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '2px 7px',
                borderRadius: 3,
                border: `1px solid ${cat.color}33`,
                background: `${cat.color}14`,
                fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                color: cat.color, textTransform: 'uppercase',
              }}
            >
              {cat.shortLabel}
            </span>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '2px 7px',
                borderRadius: 3,
                border: `1px solid ${(severityColors[event.severity] || '#71717A')}33`,
                background: `${(severityColors[event.severity] || '#71717A')}14`,
                fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                color: severityColors[event.severity] || 'var(--text-muted)',
              }}
            >
              {event.severity}
            </span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
            Event <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>#{event.id}</span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            {event.lat.toFixed(4)}°N, {event.lon.toFixed(4)}°E
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: 26, height: 26, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 5, border: '1px solid var(--border)',
            background: 'transparent', cursor: 'pointer',
            color: 'var(--text-muted)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <X size={13} />
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px 14px' }}>
        {/* AI Confidence section */}
        <SectionHeader label="AI Classifier Inference" />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '12px 0',
          borderBottom: '1px solid var(--border)',
        }}>
          <ConfidenceArc value={event.confidence} color={cat.color} />

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 5 }}>
              {cat.label}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {cat.description}
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              marginTop: 7,
              padding: '2px 8px', borderRadius: 3,
              background: 'var(--surface-3)',
              border: '1px solid var(--border)',
            }}>
              <Layers size={10} color="var(--text-muted)" />
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
                {event.landcover}
              </span>
            </div>
          </div>
        </div>

        {/* Radiometric Telemetry */}
        <SectionHeader label="Fire Radiometric Metrics" />
        <div style={{ paddingTop: 2 }}>
          <TelemRow label="Peak FRP" value={event.frp_max} unit="MW" valueColor="#EF4444" />
          <TelemRow label="Mean FRP" value={event.frp_mean} unit="MW" valueColor="#F97316" />
          <TelemRow label="Brightness Temp" value={event.brightness_max} unit="K" valueColor="#FAFAFA" />
          <TelemRow label="Duration Active" value={event.duration_days} unit="days" valueColor="#6366F1" />
          <TelemRow label="Satellite Passes" value={event.satellites_count?.toLocaleString()} />
          <TelemRow label="Date Active" value={`${event.start_date} → ${event.end_date}`} />
        </div>

        {/* Infrastructure Proximity */}
        <SectionHeader label="OSM Infrastructure Proximity" />
        <div style={{ paddingTop: 8 }}>
          <DistanceBar label="Refinery" km={event.dist_refinery_km} />
          <DistanceBar label="Power Plant" km={event.dist_power_plant_km} />
          <DistanceBar label="General Ind." km={event.dist_industry_km} />
          <DistanceBar label="Mine / Quarry" km={event.dist_mine_km} />

          <div style={{
            marginTop: 10,
            padding: '7px 10px',
            background: 'var(--surface-3)',
            borderRadius: 5,
            border: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Nearest complex</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
              {event.nearest_facility} · {event.dist_nearest_km} km
            </span>
          </div>
        </div>

        {/* Sentinel-2 SWIR Indices */}
        <SectionHeader label="Sentinel-2 Spectral Indices" />
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 6, paddingTop: 8,
        }}>
          {[
            { name: 'SWIR Ratio', value: event.s2_swir_ratio, color: '#F59E0B', hint: 'High > 1.3 = thermal' },
            { name: 'NBR (Burn)', value: event.s2_nbr, color: '#EF4444', hint: '< −0.3 = severe burn' },
            { name: 'NDVI (Veg)', value: event.s2_ndvi, color: '#10B981', hint: '< 0.2 = sparse cover' },
          ].map(idx => (
            <div
              key={idx.name}
              style={{
                padding: '8px 8px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 5,
                textAlign: 'center',
              }}
              title={idx.hint}
            >
              <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                {idx.name}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: idx.color }}>
                {idx.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div style={{
        padding: '10px 14px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: 6,
        flexShrink: 0,
      }}>
        <button
          onClick={() => onFlyTo(event.lat, event.lon, 14)}
          style={{
            flex: 1, padding: '8px',
            borderRadius: 5,
            fontSize: 12, fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: cat.color,
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = 0.85)}
          onMouseLeave={e => (e.currentTarget.style.opacity = 1)}
        >
          <Eye size={13} />
          Zoom to Site
        </button>

        <button
          onClick={downloadGeoJSON}
          title="Download GeoJSON"
          style={{
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 5,
            border: '1px solid var(--border)',
            background: 'var(--surface-2)',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <Download size={13} />
        </button>
      </div>
    </aside>
  );
}
