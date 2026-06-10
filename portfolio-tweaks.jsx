// Tweaks panel for Portfolio.html
// Applies tweaks as CSS variables / data-attributes on <html>.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#6CA0DC",
  "theme": "light",
  "fonts": "grotesk",
  "density": "regular"
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

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-ink', accentInk(t.accent, t.theme === 'dark'));
    root.setAttribute('data-theme', t.theme);
    root.setAttribute('data-fonts', t.fonts);
    root.setAttribute('data-density', t.density);
    // Keep the intro video's accent in sync
    const iv = document.getElementById('introVideoFrame');
    if (iv) {
      const want = 'Intro%20Video.html?controls=0&accent=' + encodeURIComponent(t.accent);
      if (iv.getAttribute('src') !== want) iv.setAttribute('src', want);
    }
    // Keep the AI loop's accent in sync
    const al = document.getElementById('aiLoopFrame');
    if (al) {
      const wantLoop = 'AI%20Loop.html?accent=' + encodeURIComponent(t.accent);
      if (al.getAttribute('src') !== wantLoop) al.setAttribute('src', wantLoop);
    }
  }, [t]);

  return (
    <TweaksPanel>
      <TweakSection label="Color" />
      <TweakColor label="Accent" value={t.accent}
                  options={['#6CA0DC', '#1F8A5B', '#D97757', '#7A5AE0']}
                  onChange={(v) => setTweak('accent', v)} />
      <TweakToggle label="Dark mode" value={t.theme === 'dark'}
                   onChange={(v) => setTweak('theme', v ? 'dark' : 'light')} />
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
