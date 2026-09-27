import React, { useState, useEffect } from 'react';
import { X, Eye } from 'lucide-react';
import { CLASSIFICATIONS } from '../data/categories';

export default function LiveAlertToast({ events, onSelectEvent, onFlyTo }) {
  const [alert, setAlert] = useState(null);
  const [key, setKey] = useState(0); // force re-mount for animation

  useEffect(() => {
    const critical = events.filter(e => e.classification === 'industrial_fire' && e.frp_max > 40);
    if (!critical.length) return;

    const show = () => {
      const ev = critical[Math.floor(Math.random() * critical.length)];
      setAlert(ev);
      setKey(k => k + 1);

      // Auto dismiss after 8s
      setTimeout(() => setAlert(null), 8000);
    };

    const t1 = setTimeout(show, 3500);
    const interval = setInterval(show, 35000);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, [events]);

  if (!alert) return null;

  const cat = CLASSIFICATIONS['industrial_fire'];

  return (
    <div
      key={key}
      className="alert-strip"
      style={{
        position: 'fixed',
        bottom: 80, // above scrubber
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        width: 440,
        background: 'var(--surface-2)',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(239,68,68,0.1)',
      }}
    >
      {/* Red left accent */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
        background: '#EF4444',
      }} />

      {/* Content */}
      <div style={{ padding: '10px 12px 10px 18px', display: 'flex', gap: 10, alignItems: 'center' }}>
        {/* Status icon */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ position: 'relative', width: 28, height: 28 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '1.5px solid rgba(239,68,68,0.5)',
              animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
              opacity: 0.6,
            }} />
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#EF4444">
                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Alert message */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: '#EF4444',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2,
          }}>
            ● Satellite Intercept — Industrial Thermal Spike
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
            Event <span style={{ fontFamily: 'JetBrains Mono', color: '#FCA5A5' }}>#{alert.id}</span>
            {' '}·{' '}
            <span style={{ color: 'var(--text-secondary)' }}>{alert.nearest_facility}</span>
            {' '}at{' '}
            <span style={{ fontFamily: 'JetBrains Mono', color: '#EF4444', fontWeight: 700 }}>{alert.frp_max} MW</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>
            {alert.lat.toFixed(3)}, {alert.lon.toFixed(3)} · AI confidence {alert.confidence}%
          </div>
        </div>

        {/* Inspect button */}
        <button
          onClick={() => { onSelectEvent(alert); onFlyTo(alert.lat, alert.lon, 14); setAlert(null); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 5,
            fontSize: 11, fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid rgba(239,68,68,0.35)',
            background: 'rgba(239,68,68,0.12)',
            color: '#EF4444',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.22)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
        >
          <Eye size={11} />
          Inspect
        </button>

        {/* Dismiss */}
        <button
          onClick={() => setAlert(null)}
          style={{
            width: 22, height: 22, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 4, border: 'none',
            background: 'transparent', cursor: 'pointer',
            color: 'var(--text-muted)', transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <X size={12} />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      <div style={{ height: 2, background: 'var(--surface-3)', position: 'relative', overflow: 'hidden' }}>
        <div
          className="alert-progress"
          style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#EF4444', opacity: 0.7 }}
        />
      </div>
    </div>
  );
}
