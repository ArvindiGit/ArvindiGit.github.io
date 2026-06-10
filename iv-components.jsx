// iv-components.jsx — terminal primitives for the intro video
// Exports to window: IVCursor, IVTypedCommand, IVReveal, IVChip, IVScene,
//   IVSectionTag, IVWindow, IV_COLORS, useIVTyped

const IV_COLORS = {
  canvas: '#0b0b0a',
  window: '#121210',
  chrome: '#1b1a18',
  border: '#2a2826',
  text: '#d9d4c8',
  dim: '#8a8475',
  faint: '#5c574c',
  green: '#8fbf6f',
  yellow: '#d4b14f',
};

const IV_MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

// ── typing helper ────────────────────────────────────────────────────────────
function useIVTyped(text, localTime, start, cps = 16) {
  const n = clamp(Math.floor((localTime - start) * cps), 0, text.length);
  return { typed: text.slice(0, n), typing: localTime >= start && n < text.length, doneAt: start + text.length / cps };
}

// ── blinking block cursor ────────────────────────────────────────────────────
function IVCursor({ solid = false, color = 'var(--iv-accent)', size = '1em' }) {
  const time = useTime();
  const visible = solid || Math.floor(time * 2.6) % 2 === 0;
  return (
    <span style={{
      display: 'inline-block',
      width: `calc(${size} * 0.55)`,
      height: `calc(${size} * 1.05)`,
      background: color,
      verticalAlign: 'text-bottom',
      marginLeft: '0.15em',
      opacity: visible ? 1 : 0,
      boxShadow: visible ? `0 0 18px color-mix(in oklab, ${color} 55%, transparent)` : 'none',
    }}></span>
  );
}

// ── prompt + typed command line ──────────────────────────────────────────────
// Shows "arvind@portfolio:~$" prompt; types `cmd` starting at `start` (localTime).
// Before `start` (if showBefore) the prompt sits with a blinking cursor.
function IVTypedCommand({ cmd, start = 0, cps = 15, dir = '~', size = 30, showBefore = true, keepCursor = false }) {
  const { localTime } = useSprite();
  const { typed, typing, doneAt } = useIVTyped(cmd, localTime, start, cps);
  if (!showBefore && localTime < start) return null;
  const showCursor = typing || localTime < start || keepCursor || localTime < doneAt + 0.4;
  return (
    <div style={{ fontFamily: IV_MONO, fontSize: size, lineHeight: 1.5, whiteSpace: 'pre', color: IV_COLORS.text }}>
      <span style={{ color: IV_COLORS.green }}>arvind@portfolio</span>
      <span style={{ color: IV_COLORS.faint }}>:{dir}$</span>
      <span> {typed}</span>
      {showCursor ? <IVCursor solid={typing}></IVCursor> : null}
    </div>
  );
}

// ── generic reveal (fade + rise) ─────────────────────────────────────────────
function IVReveal({ at = 0, dur = 0.38, dy = 16, children, style = {}, block = true }) {
  const { localTime } = useSprite();
  if (localTime < at) return null;
  const t = Easing.easeOutCubic(clamp((localTime - at) / dur, 0, 1));
  return (
    <div style={{
      display: block ? 'block' : 'inline-block',
      opacity: t,
      transform: `translateY(${(1 - t) * dy}px)`,
      willChange: 'transform, opacity',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── skill chip (pop-in) ──────────────────────────────────────────────────────
function IVChip({ label, at = 0, accent = false, size = 27 }) {
  const { localTime } = useSprite();
  if (localTime < at) return null;
  const t = clamp((localTime - at) / 0.4, 0, 1);
  const s = 0.6 + 0.4 * Easing.easeOutBack(t);
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '10px 22px',
      border: `1.5px solid ${accent ? 'var(--iv-accent)' : IV_COLORS.border}`,
      borderRadius: 6,
      color: accent ? 'var(--iv-accent)' : IV_COLORS.text,
      background: accent ? 'color-mix(in oklab, var(--iv-accent) 10%, transparent)' : 'rgba(255,255,255,0.02)',
      fontFamily: IV_MONO,
      fontSize: size,
      opacity: t,
      transform: `scale(${s})`,
      willChange: 'transform, opacity',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </div>
  );
}

// ── section tag: "// 01 PROFILE" ─────────────────────────────────────────────
function IVSectionTag({ num, label, at = 0 }) {
  return (
    <IVReveal at={at} dy={10} style={{ marginBottom: 34 }}>
      <div style={{ fontFamily: IV_MONO, fontSize: 26, letterSpacing: '0.35em', color: IV_COLORS.dim }}>
        <span style={{ color: 'var(--iv-accent)' }}>//</span> {num} <span style={{ color: IV_COLORS.text }}>{label}</span>
      </div>
    </IVReveal>
  );
}

// ── scene shell: fade in/out + slow zoom ─────────────────────────────────────
function IVScene({ start, end, zoomTo = 1.035, fadeIn = 0.22, fadeOut = 0.32, label, children }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration, progress }) => {
        let opacity = 1;
        if (localTime < fadeIn) opacity = Easing.easeOutQuad(localTime / fadeIn);
        else if (localTime > duration - fadeOut) opacity = 1 - Easing.easeInQuad((localTime - (duration - fadeOut)) / fadeOut);
        const scale = 1 + (zoomTo - 1) * progress;
        return (
          <div data-screen-label={label} style={{
            position: 'absolute', inset: 0,
            padding: '60px 84px',
            boxSizing: 'border-box',
            opacity,
            transform: `scale(${scale})`,
            transformOrigin: '50% 45%',
            willChange: 'transform, opacity',
          }}>
            {children}
          </div>
        );
      }}
    </Sprite>
  );
}

// ── terminal window chrome ───────────────────────────────────────────────────
function IVWindow({ scanlines = true, children }) {
  return (
    <div style={{
      position: 'absolute', left: 100, right: 100, top: 70, bottom: 70,
      background: IV_COLORS.window,
      border: `1px solid ${IV_COLORS.border}`,
      borderRadius: 14,
      boxShadow: '0 40px 110px rgba(0,0,0,0.6)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* title bar */}
      <div style={{
        height: 56, flexShrink: 0,
        background: IV_COLORS.chrome,
        borderBottom: `1px solid ${IV_COLORS.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 26px',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: '#5e4540' }}></span>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: '#5e5740' }}></span>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: '#465e40' }}></span>
        </div>
        <div style={{
          position: 'absolute', left: 0, right: 0, textAlign: 'center',
          fontFamily: IV_MONO, fontSize: 21, color: IV_COLORS.dim, pointerEvents: 'none',
        }}>
          arvind@portfolio — zsh
        </div>
      </div>
      {/* content */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {children}
      </div>
      {/* scanlines + vignette */}
      {scanlines ? (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 4px)',
        }}></div>
      ) : null}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 95% 85% at 50% 42%, transparent 55%, rgba(0,0,0,0.4) 100%)',
      }}></div>
    </div>
  );
}

Object.assign(window, {
  IV_COLORS, IV_MONO, useIVTyped,
  IVCursor, IVTypedCommand, IVReveal, IVChip, IVSectionTag, IVScene, IVWindow,
});
