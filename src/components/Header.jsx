import React from 'react';
import { Satellite, Crosshair, ShieldAlert, Moon, Sun, BarChart2, Download, Circle } from 'lucide-react';
import { BASEMAPS } from '../data/categories';

export default function Header({
  totalEvents,
  filteredEventsCount,
  highRiskCount,
  activeBasemap,
  setActiveBasemap,
  onOpenAnalytics,
  onExportGeoJSON,
}) {
  return (
    <header
      style={{
        height: '52px',
        background: 'var(--surface-1)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        zIndex: 30,
        gap: '0',
      }}
    >
      {/* ── BRAND ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Logo mark */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #EF4444, #F97316)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,0.15)" />
            <path d="M12 6c-.4 0-.8.3-.9.7L9 14h2v4l5-8h-3l1.9-4H12z" fill="white" />
          </svg>
          {/* Live dot */}
          <span
            className="pulse-dot"
            style={{
              position: 'absolute',
              top: -3, right: -3,
              width: 7, height: 7,
              borderRadius: '50%',
              background: '#EF4444',
              border: '1.5px solid var(--canvas)',
            }}
          />
        </div>

        <div>
          <div
            className="text-display"
            style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.03em' }}
          >
            AeroThermal<span style={{ color: '#EF4444' }}>.AI</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.03em' }}>
            Industrial Fire &amp; Wildfire Intelligence
          </div>
        </div>
      </div>

      {/* ── CENTRE STATS (Vercel-style stat bar) ──────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 0,
          height: '100%',
          flexShrink: 0,
        }}
      >
        {[
          {
            icon: <Crosshair size={12} color="#6366F1" />,
            label: 'Thermal Events',
            value: filteredEventsCount.toLocaleString(),
            sub: `/ ${totalEvents.toLocaleString()}`,
            valueColor: '#FAFAFA',
          },
          {
            icon: <ShieldAlert size={12} color="#EF4444" />,
            label: 'Critical Incidents',
            value: highRiskCount.toString(),
            sub: 'industrial',
            valueColor: '#EF4444',
          },
          {
            icon: <Satellite size={12} color="#06B6D4" />,
            label: 'Data Source',
            value: 'NASA FIRMS',
            sub: '+ GEE S2',
            valueColor: '#06B6D4',
          },
        ].map((stat, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ width: 1, background: 'var(--border)', margin: '10px 0' }} />
            )}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 16px',
                gap: 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {stat.icon}
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  {stat.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: stat.valueColor, letterSpacing: '-0.02em' }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                  {stat.sub}
                </span>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ── RIGHT CONTROLS ─────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {/* Basemap segmented control */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--surface-3)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: 2,
            gap: 1,
          }}
        >
          {BASEMAPS.map((bm) => {
            const isActive = activeBasemap === bm.id;
            return (
              <button
                key={bm.id}
                onClick={() => setActiveBasemap(bm.id)}
                title={bm.name}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.15s ease',
                  background: isActive ? 'var(--surface-hover)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: isActive ? 'inset 0 0 0 1px var(--border-strong)' : 'none',
                }}
              >
                {bm.id === 'dark' ? <Moon size={11} /> : bm.id === 'satellite' ? <Satellite size={11} /> : <Sun size={11} />}
                <span style={{ fontSize: 11 }}>{bm.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: 'var(--border)' }} />

        {/* Analytics icon button */}
        <button
          onClick={onOpenAnalytics}
          title="Open Analytics Dashboard"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <BarChart2 size={13} />
          <span>Analytics</span>
        </button>

        {/* Export icon button */}
        <button
          onClick={onExportGeoJSON}
          title="Export filtered events as GeoJSON"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <Download size={13} />
          <span>Export GeoJSON</span>
        </button>
      </div>
    </header>
  );
}
