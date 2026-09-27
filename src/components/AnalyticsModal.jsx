import React from 'react';
import { X, Download } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { CLASSIFICATIONS } from '../data/categories';

function StatCard({ label, value, color }) {
  return (
    <div style={{
      padding: '14px 16px',
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 6,
    }}>
      <div className="text-label" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 22, fontWeight: 700,
        color: color || 'var(--text-primary)', letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: 'var(--surface-2)', border: '1px solid var(--border)',
      borderRadius: 5, padding: '8px 12px', fontSize: 11,
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
      <div style={{ color: 'var(--text-primary)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
        {payload[0].value?.toLocaleString()}
      </div>
    </div>
  );
};

export default function AnalyticsModal({ isOpen, onClose, events }) {
  if (!isOpen) return null;

  const classBreakdown = Object.values(CLASSIFICATIONS).map(cat => ({
    name: cat.shortLabel, id: cat.id,
    count: events.filter(e => e.classification === cat.id).length,
    color: cat.color,
    totalFRP: Math.round(events.filter(e => e.classification === cat.id).reduce((s, e) => s + e.frp_max, 0)),
  }));

  const proximityData = [
    { range: '< 1 km', count: events.filter(e => e.dist_nearest_km <= 1).length },
    { range: '1–3 km', count: events.filter(e => e.dist_nearest_km > 1 && e.dist_nearest_km <= 3).length },
    { range: '3–5 km', count: events.filter(e => e.dist_nearest_km > 3 && e.dist_nearest_km <= 5).length },
    { range: '5–10 km', count: events.filter(e => e.dist_nearest_km > 5 && e.dist_nearest_km <= 10).length },
    { range: '> 10 km', count: events.filter(e => e.dist_nearest_km > 10).length },
  ];

  const topEvents = [...events]
    .filter(e => ['industrial_fire', 'gas_flare'].includes(e.classification))
    .sort((a, b) => b.frp_max - a.frp_max)
    .slice(0, 8);

  const industrialCount = events.filter(e => e.classification === 'industrial_fire').length;
  const flareCount = events.filter(e => e.classification === 'gas_flare').length;
  const avgConf = events.length ? (events.reduce((s, e) => s + e.confidence, 0) / events.length).toFixed(1) : 0;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="animate-fade-up"
        style={{
          width: '100%', maxWidth: 960,
          maxHeight: '90vh',
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div className="text-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
              Mission Intelligence Report
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              AeroThermal-AI · Multi-Sensor Thermal Anomaly Segregation Analysis · SIH 2024
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 30, height: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 6, border: '1px solid var(--border)',
              background: 'transparent', cursor: 'pointer',
              color: 'var(--text-muted)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
            <StatCard label="Total Analyzed Events" value={events.length.toLocaleString()} />
            <StatCard label="Industrial Incidents" value={industrialCount.toLocaleString()} color="#EF4444" />
            <StatCard label="Persistent Gas Flares" value={flareCount.toLocaleString()} color="#F97316" />
            <StatCard label="Avg AI Confidence" value={`${avgConf}%`} color="#10B981" />
          </div>

          {/* Charts row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {/* Donut */}
            <div style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 6, padding: 16,
            }}>
              <div className="text-label" style={{ marginBottom: 12 }}>Anomaly Classification Breakdown</div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: 180 }}>
                <ResponsiveContainer width="55%" height="100%">
                  <PieChart>
                    <Pie data={classBreakdown} dataKey="count" cx="50%" cy="50%" innerRadius={44} outerRadius={70} paddingAngle={3}>
                      {classBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                  {classBreakdown.map(cat => (
                    <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 3, height: 14, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>{cat.name}</div>
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, color: cat.color }}>
                        {cat.count.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar */}
            <div style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 6, padding: 16,
            }}>
              <div className="text-label" style={{ marginBottom: 12 }}>Events by Distance to Critical Infrastructure</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={proximityData} barSize={22}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="range" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="count" fill="#6366F1" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Events Table */}
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 6, overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <span className="text-label">Highest Intensity Industrial Thermal Events</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Event ID', 'Coordinates', 'Nearest Complex', 'Distance', 'Peak FRP', 'Duration', 'AI Score'].map(h => (
                    <th key={h} style={{
                      padding: '8px 14px', textAlign: 'left',
                      fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
                      textTransform: 'uppercase', color: 'var(--text-muted)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topEvents.map((e, i) => (
                  <tr
                    key={e.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    }}
                  >
                    <td style={{ padding: '8px 14px', fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#FAFAFA' }}>#{e.id}</td>
                    <td style={{ padding: '8px 14px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', fontSize: 10 }}>
                      {e.lat.toFixed(3)}, {e.lon.toFixed(3)}
                    </td>
                    <td style={{ padding: '8px 14px', color: 'var(--text-secondary)' }}>{e.nearest_facility}</td>
                    <td style={{ padding: '8px 14px', fontFamily: 'JetBrains Mono', color: '#06B6D4', fontWeight: 600 }}>{e.dist_nearest_km} km</td>
                    <td style={{ padding: '8px 14px', fontFamily: 'JetBrains Mono', color: '#EF4444', fontWeight: 700 }}>{e.frp_max} MW</td>
                    <td style={{ padding: '8px 14px', fontFamily: 'JetBrains Mono', color: '#6366F1' }}>{e.duration_days}d</td>
                    <td style={{ padding: '8px 14px', fontFamily: 'JetBrains Mono', color: '#10B981', fontWeight: 700 }}>{e.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0, background: 'var(--surface-2)',
        }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
            SIH 2024 · AeroThermal-AI Geospatial Intelligence Platform
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '7px 16px', borderRadius: 5,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: '1px solid var(--border-strong)',
              background: 'var(--surface-3)', color: 'var(--text-primary)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-3)'; }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
