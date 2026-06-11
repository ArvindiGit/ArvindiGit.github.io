// promo-parts.jsx — shared visual parts for the portfolio promo video.
// Uses the portfolio's exact design tokens (portfolio.css).

const PV = {
  bg: '#fafaf8',
  surface: '#ffffff',
  ink: '#16181d',
  inkSoft: '#4b5058',
  inkFaint: '#8a8f98',
  line: '#e6e6e2',
  accent: '#6CA0DC',
  accentInk: 'rgb(67, 99, 136)',
  darkBg: '#101216',
  darkSurface: '#181b21',
  darkInk: '#eceef1',
  darkSoft: '#b3b9c2',
  darkLine: '#272b33',
  display: '"Space Grotesk", sans-serif',
  mono: '"IBM Plex Mono", monospace',
};

// Deterministic pseudo-random from an index
function pvRnd(i, salt) {
  const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

// makePath([{t,x,y},...]) -> (t) => {x,y} with smooth ease between waypoints
function makePath(pts) {
  const ts = pts.map((p) => p.t);
  const fx = interpolate(ts, pts.map((p) => p.x), Easing.easeInOutCubic);
  const fy = interpolate(ts, pts.map((p) => p.y), Easing.easeInOutCubic);
  return (t) => ({ x: fx(t), y: fy(t) });
}

// Scene-level fade in/out helper
function sceneFade(localTime, duration, fadeIn = 0.45, fadeOut = 0.45) {
  const fin = clamp(localTime / fadeIn, 0, 1);
  const fout = clamp((duration - localTime) / fadeOut, 0, 1);
  return Math.min(fin, fout);
}

// ── Animated cursor with glowing accent trail (recreates the site effect) ──
function PromoCursor({ pathFn, time, accent = PV.accent, clicks = [], scale = 1 }) {
  const pos = pathFn(time);
  const TRAIL = 13;
  const dots = [];
  for (let k = 1; k <= TRAIL; k++) {
    const p = pathFn(Math.max(0, time - k * 0.045));
    const f = 1 - k / (TRAIL + 1);
    dots.push(
      <div key={k} style={{
        position: 'absolute',
        left: p.x, top: p.y,
        width: 14 * f * scale, height: 14 * f * scale,
        borderRadius: '50%',
        background: accent,
        opacity: 0.38 * f,
        filter: 'blur(1.5px)',
        boxShadow: `0 0 ${10 * f}px ${accent}`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}></div>
    );
  }

  // Click pulse rings
  const rings = clicks.map((ct, i) => {
    const dt = time - ct;
    if (dt < 0 || dt > 0.6) return null;
    const f = dt / 0.6;
    const p = pathFn(ct);
    return (
      <div key={'r' + i} style={{
        position: 'absolute',
        left: p.x, top: p.y,
        width: 16 + 70 * Easing.easeOutCubic(f),
        height: 16 + 70 * Easing.easeOutCubic(f),
        borderRadius: '50%',
        border: `2.5px solid ${accent}`,
        opacity: 1 - f,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}></div>
    );
  });

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      {dots}
      {rings}
      <svg width={30 * scale} height={34 * scale} viewBox="0 0 13 20" style={{
        position: 'absolute', left: pos.x, top: pos.y,
        transform: 'translate(-2px, -2px)',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
      }}>
        <path d="M1 1 L1 16.5 L5.2 12.8 L7.6 18.6 L10.1 17.5 L7.8 11.9 L12.4 11.3 Z"
              fill="#16181d" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round"></path>
      </svg>
    </div>
  );
}

// ── Caption chip (bottom-left, mono, like the site's kickers) ──
function CaptionChip({ text, show, x = 110, y = 960, dark = false }) {
  const f = Easing.easeOutCubic(clamp(show, 0, 1));
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: PV.mono, fontSize: 24, letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: dark ? PV.accent : PV.accentInk,
      opacity: f,
      transform: `translateY(${(1 - f) * 18}px)`,
    }}>
      <span style={{ opacity: 0.55 }}>{'//'}</span>
      <span>{text}</span>
      <span style={{
        display: 'inline-block', width: 90 * f, height: 2,
        background: dark ? PV.accent : PV.accentInk, opacity: 0.5,
      }}></span>
    </div>
  );
}

// ── Headline whose characters scatter in (recreates the particle headline) ──
function ScatterLine({ text, x, y, size = 76, delay = 0, t, color = PV.ink, em = null, emColor = PV.accentInk }) {
  const chars = text.split('');
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      fontFamily: PV.display, fontWeight: 700, fontSize: size,
      letterSpacing: '-0.025em', lineHeight: 1.08, whiteSpace: 'pre',
    }}>
      {chars.map((ch, i) => {
        const start = delay + i * 0.022;
        const f = Easing.easeOutCubic(clamp((t - start) / 0.55, 0, 1));
        const dx = (pvRnd(i, 1) - 0.5) * 160 * (1 - f);
        const dy = (pvRnd(i, 2) - 0.5) * 200 * (1 - f);
        const rot = (pvRnd(i, 3) - 0.5) * 70 * (1 - f);
        const isEm = em && i >= em[0] && i < em[1];
        return (
          <span key={i} style={{
            display: 'inline-block',
            opacity: f,
            transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
            color: isEm ? emColor : color,
            minWidth: ch === ' ' ? '0.28em' : undefined,
          }}>{ch === ' ' ? '\u00A0' : ch}</span>
        );
      })}
    </div>
  );
}

// ── Mini sidebar (recreates the portfolio's left rail) ──
function MiniSidebar({ t, dark = false, x = 110, y = 130 }) {
  const ink = dark ? PV.darkInk : PV.ink;
  const faint = dark ? '#6f7680' : PV.inkFaint;
  const navItems = ['About', 'Work', 'Experience', 'AI-Powered Dev', 'Skills', 'Contact'];
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 300 }}>
      <div style={{
        fontFamily: PV.display, fontWeight: 700, fontSize: 46, lineHeight: 1.1,
        letterSpacing: '-0.02em', color: ink,
        opacity: clamp(t / 0.4, 0, 1),
      }}>Arvind<br />Prajapati</div>
      <div style={{
        fontFamily: PV.mono, fontSize: 18, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: dark ? PV.accent : PV.accentInk,
        marginTop: 10, opacity: clamp((t - 0.2) / 0.4, 0, 1),
      }}>&gt; Software Engineer</div>
      <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {navItems.map((n, i) => {
          const f = Easing.easeOutCubic(clamp((t - 0.35 - i * 0.09) / 0.4, 0, 1));
          const active = i === 0;
          return (
            <div key={n} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              fontFamily: PV.mono, fontSize: 18, letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: active ? ink : faint,
              opacity: f, transform: `translateX(${(1 - f) * -20}px)`,
            }}>
              <span style={{
                width: active ? 56 : 26, height: active ? 3 : 1.5,
                background: active ? PV.accent : faint,
              }}></span>
              {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Skeleton text bar ──
function Bar({ w, h = 14, color = PV.line, r = 7, style = {} }) {
  return <div style={{ width: w, height: h, background: color, borderRadius: r, ...style }}></div>;
}

Object.assign(window, {
  PV, pvRnd, makePath, sceneFade,
  PromoCursor, CaptionChip, ScatterLine, MiniSidebar, Bar,
});
