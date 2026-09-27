import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TimePlaybackScrubber({
  allDates, currentDateIndex, setCurrentDateIndex,
  isPlaying, setIsPlaying, dateCounts,
}) {
  const [speed, setSpeed] = useState(1);
  const canvasRef = useRef(null);
  const maxIndex = Math.max(0, allDates.length - 1);
  const currentDate = allDates[currentDateIndex] || '—';

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentDateIndex(prev => {
        if (prev >= maxIndex) { setIsPlaying(false); return 0; }
        return prev + 1;
      });
    }, 1000 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, maxIndex]);

  // Draw mini histogram to canvas
  const maxCount = useMemo(() => Math.max(1, ...allDates.map(d => dateCounts[d] || 0)), [allDates, dateCounts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || allDates.length === 0) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const barW = W / allDates.length;

    allDates.forEach((d, i) => {
      const count = dateCounts[d] || 0;
      const h = Math.max(2, (count / maxCount) * H);
      const isPast = i <= currentDateIndex;
      const isCurrent = i === currentDateIndex;

      ctx.fillStyle = isCurrent
        ? '#EF4444'
        : isPast
        ? 'rgba(239,68,68,0.35)'
        : 'rgba(255,255,255,0.06)';

      ctx.fillRect(
        Math.floor(i * barW),
        H - h,
        Math.max(1, barW - 1),
        h
      );
    });
  }, [allDates, dateCounts, currentDateIndex, maxCount]);

  const pct = maxIndex > 0 ? (currentDateIndex / maxIndex) * 100 : 0;

  return (
    <div style={{
      height: 72,
      background: 'var(--surface-1)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 14px',
      flexShrink: 0,
      zIndex: 20,
    }}>
      {/* Controls column */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <button
          onClick={() => setCurrentDateIndex(0)}
          title="Reset"
          style={{
            width: 26, height: 26,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 4, border: '1px solid var(--border)',
            background: 'transparent', cursor: 'pointer',
            color: 'var(--text-muted)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <RotateCcw size={11} />
        </button>

        <button
          onClick={() => setCurrentDateIndex(i => Math.max(0, i - 1))}
          style={{
            width: 26, height: 26,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 4, border: '1px solid var(--border)',
            background: 'transparent', cursor: 'pointer',
            color: 'var(--text-muted)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <ChevronLeft size={13} />
        </button>

        {/* Play / Pause */}
        <button
          onClick={() => setIsPlaying(p => !p)}
          style={{
            width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 6,
            border: 'none',
            background: isPlaying ? '#F59E0B' : '#EF4444',
            cursor: 'pointer',
            color: 'white',
            transition: 'background 0.15s',
          }}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <button
          onClick={() => setCurrentDateIndex(i => Math.min(maxIndex, i + 1))}
          style={{
            width: 26, height: 26,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 4, border: '1px solid var(--border)',
            background: 'transparent', cursor: 'pointer',
            color: 'var(--text-muted)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <ChevronRight size={13} />
        </button>

        {/* Speed pills */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 1,
          background: 'var(--surface-3)', border: '1px solid var(--border)',
          borderRadius: 4, padding: '2px 2px', marginLeft: 4,
        }}>
          {[1, 2, 4].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                padding: '2px 7px',
                borderRadius: 3, fontSize: 10, fontWeight: 700,
                fontFamily: 'JetBrains Mono',
                cursor: 'pointer', border: 'none',
                background: speed === s ? 'var(--surface-hover)' : 'transparent',
                color: speed === s ? '#06B6D4' : 'var(--text-muted)',
                transition: 'all 0.12s',
              }}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 36, background: 'var(--border)', flexShrink: 0 }} />

      {/* Timeline */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
        {/* Date stamp */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700,
              color: 'var(--text-primary)', letterSpacing: '-0.01em',
            }}>
              {currentDate}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {(dateCounts[currentDate] || 0).toLocaleString()} events
            </span>
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
            {allDates[0]} → {allDates[allDates.length - 1]}
          </span>
        </div>

        {/* Histogram canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={22}
          style={{ width: '100%', height: 22, borderRadius: 2, cursor: 'pointer' }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setCurrentDateIndex(Math.round(pct * maxIndex));
          }}
        />

        {/* Slider */}
        <input
          type="range"
          className="custom-slider"
          min="0" max={maxIndex} step="1"
          value={currentDateIndex}
          onChange={e => setCurrentDateIndex(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, rgba(239,68,68,0.6) ${pct}%, var(--surface-3) ${pct}%)`,
          }}
        />
      </div>

      {/* Right date range label */}
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div className="text-label">Mission Temporal Scope</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color: '#6366F1', marginTop: 2 }}>
          May 2024 – Sep 2024
        </div>
      </div>
    </div>
  );
}
