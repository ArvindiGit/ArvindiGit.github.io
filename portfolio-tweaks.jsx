// Tweaks panel for Portfolio.html
// Applies tweaks as CSS variables / data-attributes on <html>.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#6CA0DC",
  "theme": "light",
  "fonts": "grotesk",
  "density": "regular",
  "cursor": "on",
  "herofx": "on"
}/*EDITMODE-END*/;

function accentInk(hex, dark) {
  // Darken the accent for readable text on light bg; keep as-is on dark.
  if (dark) return hex;
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = 0.62;
  return `rgb(${Math.round(r * f)}, ${Math.round(g * f)}, ${Math.round(b * f)})`;
}

function PortfolioTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const mountAt = React.useRef(Date.now());
  const lastApplied = React.useRef(null);
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-fonts', t.fonts);
    root.setAttribute('data-density', t.density);
    root.setAttribute('data-cursor', t.cursor);
    root.setAttribute('data-herofx', t.herofx);

    // Theme + accent are shared with the on-page theme controls
    // (window.__applySitePrefs also keeps the video iframes in sync).
    // Two guards against state thrash:
    //  1. Settling window (~1.5s after mount): tweak-state changes here are
    //     async persistence/host syncs, not user actions — absorb them and
    //     let a saved on-page preference win (apply without persisting only
    //     if no on-page preference exists).
    //  2. After that, only apply when theme/accent VALUES actually changed
    //     (identity-only re-runs of the effect must not re-assert state).
    let hasSite = false;
    try { hasSite = !!localStorage.getItem('arvind-site-prefs'); } catch (e) {}

    const vals = { theme: t.theme, accent: t.accent };
    const changed = !lastApplied.current ||
      lastApplied.current.theme !== vals.theme ||
      lastApplied.current.accent !== vals.accent;

    const applySite = (persist) => {
      if (window.__applySitePrefs) {
        window.__applySitePrefs(vals.theme, vals.accent, persist);
      } else {
        root.style.setProperty('--accent', vals.accent);
        root.style.setProperty('--accent-ink', accentInk(vals.accent, vals.theme === 'dark'));
        root.setAttribute('data-theme', vals.theme);
      }
    };

    if (Date.now() - mountAt.current < 1500) {
      lastApplied.current = vals;
      if (!hasSite) applySite(false);
      return;
    }

    if (!changed) return;
    lastApplied.current = vals;
    applySite(true);
  }, [t]);

  return (
    <TweaksPanel>
      <TweakSection label="Color" />
      <TweakColor label="Accent" value={t.accent}
                  options={['#6CA0DC', '#1F8A5B', '#D97757', '#7A5AE0']}
                  onChange={(v) => setTweak('accent', v)} />
      <TweakToggle label="Dark mode" value={t.theme === 'dark'}
                   onChange={(v) => setTweak('theme', v ? 'dark' : 'light')} />
      <TweakToggle label="Cursor trail" value={t.cursor === 'on'}
                   onChange={(v) => setTweak('cursor', v ? 'on' : 'off')} />
      <TweakToggle label="Headline particles" value={t.herofx === 'on'}
                   onChange={(v) => setTweak('herofx', v ? 'on' : 'off')} />
      <TweakSection label="Type & layout" />
      <TweakRadio label="Fonts" value={t.fonts}
                  options={['grotesk', 'editorial']}
                  onChange={(v) => setTweak('fonts', v)} />
      <TweakRadio label="Density" value={t.density}
                  options={['compact', 'regular', 'airy']}
                  onChange={(v) => setTweak('density', v)} />
    </TweaksPanel>
  );
}

const tweaksRootEl = document.createElement('div');
document.body.appendChild(tweaksRootEl);
ReactDOM.createRoot(tweaksRootEl).render(<PortfolioTweaks />);
