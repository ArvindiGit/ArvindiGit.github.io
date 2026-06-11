// promo-scenes.jsx — scene compositions for the portfolio promo video.
// Timeline (33s total):
//   0.0 –  4.5  Terminal intro
//   4.5 – 11.0  Hero: particle headline + cursor trail
//  11.0 – 17.5  Project cards: 3D tilt
//  17.5 – 22.5  Magnetic contact links
//  22.5 – 27.5  Dark mode wipe + accent cycling
//  27.5 – 33.0  Outro card

// ── Scene 1: Terminal intro ─────────────────────────────────────────────
function SceneTerminal() {
  const { localTime: t, duration } = useSprite();
  const fade = sceneFade(t, duration, 0.3, 0.5);

  const line1 = 'arvind@dev:~$ ';
  const cmd = 'open portfolio --live';
  const typed = cmd.slice(0, Math.floor(clamp((t - 0.7) / 1.6, 0, 1) * cmd.length));
  const showOk = t > 2.7;
  const scaleUp = 1 + 0.02 * Easing.easeInOutSine(clamp(t / duration, 0, 1));

  return (
    <div style={{ position: 'absolute', inset: 0, background: PV.bg, opacity: fade }}>
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: `translate(-50%, -50%) scale(${scaleUp})`,
        width: 980, borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(22,24,29,0.18)',
        border: `1px solid ${PV.line}`,
      }}>
        <div style={{
          background: '#eceae6', padding: '16px 22px',
          display: 'flex', alignItems: 'center', gap: 9,
        }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#f57d72' }}></span>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#f5bd4f' }}></span>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#56c454' }}></span>
          <span style={{
            marginLeft: 18, fontFamily: PV.mono, fontSize: 16, color: PV.inkFaint,
          }}>arvind — portfolio</span>
        </div>
        <div style={{
          background: PV.darkBg, padding: '40px 44px 48px 44px',
          fontFamily: PV.mono, fontSize: 26, lineHeight: 1.9, minHeight: 220,
        }}>
          <div>
            <span style={{ color: '#3eb06f' }}>{line1}</span>
            <span style={{ color: PV.darkInk }}>{typed}</span>
            <span style={{
              display: 'inline-block', width: 13, height: 28,
              background: PV.accent, verticalAlign: '-4px', marginLeft: 4,
              opacity: Math.floor(t * 2.2) % 2 === 0 ? 1 : 0,
            }}></span>
          </div>
          {showOk && (
            <div style={{ color: PV.darkSoft, opacity: clamp((t - 2.7) / 0.4, 0, 1) }}>
              <span style={{ color: PV.accent }}>✓</span> react · next.js · ai-powered dev
            </div>
          )}
          {t > 3.3 && (
            <div style={{ color: PV.darkSoft, opacity: clamp((t - 3.3) / 0.4, 0, 1) }}>
              <span style={{ color: PV.accent }}>✓</span> launching…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Scene 2: Hero — particle headline + cursor trail ────────────────────
const heroPath = makePath([
  { t: 0.0, x: 1620, y: 950 },
  { t: 1.4, x: 1500, y: 820 },
  { t: 2.6, x: 620, y: 420 },
  { t: 3.8, x: 1320, y: 520 },
  { t: 5.0, x: 760, y: 650 },
  { t: 6.0, x: 1150, y: 560 },
  { t: 7.0, x: 1450, y: 700 },
]);

function SceneHero() {
  const { localTime: t, duration } = useSprite();
  const fade = sceneFade(t, duration, 0.4, 0.5);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PV.bg, opacity: fade }}>
      <MiniSidebar t={t} />
      <div style={{
        position: 'absolute', left: 560, top: 150,
        fontFamily: PV.mono, fontSize: 20, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: PV.accentInk,
        opacity: clamp((t - 0.2) / 0.4, 0, 1),
      }}>{'// About me'}</div>

      <ScatterLine text="I build clean, working" x={560} y={230} t={t} delay={0.5} size={86} />
      <ScatterLine text="software — and I" x={560} y={340} t={t} delay={1.0} size={86} />
      <ScatterLine text="think with AI." x={560} y={450} t={t} delay={1.4} size={86} em={[0, 14]} />

      <div style={{
        position: 'absolute', left: 560, top: 600, width: 820,
        fontFamily: PV.display, fontSize: 27, lineHeight: 1.6, color: PV.inkSoft,
        opacity: clamp((t - 2.4) / 0.6, 0, 1),
      }}>
        Software engineer with ~2 years of hands-on experience building
        production web apps in React and JavaScript.
      </div>

      <div style={{
        position: 'absolute', left: 560, top: 740,
        display: 'flex', alignItems: 'center', gap: 16,
        fontFamily: PV.mono, fontSize: 19, color: PV.inkFaint,
        opacity: clamp((t - 2.9) / 0.5, 0, 1),
      }}>
        <span style={{
          width: 12, height: 12, borderRadius: '50%', background: '#3eb06f',
          boxShadow: '0 0 0 6px rgba(62,176,111,0.15)',
        }}></span>
        Available for new opportunities · Deoria, UP, India
      </div>

      <CaptionChip text="Particle headline + cursor trail" show={(t - 2.2) / 0.5} />
      <PromoCursor pathFn={heroPath} time={t} />
    </div>
  );
}

// ── Scene 3: Project cards with 3D tilt ─────────────────────────────────
const cardsPath = makePath([
  { t: 0.0, x: 1700, y: 980 },
  { t: 1.2, x: 470, y: 520 },
  { t: 2.4, x: 560, y: 640 },
  { t: 3.4, x: 960, y: 540 },
  { t: 4.4, x: 1010, y: 660 },
  { t: 5.3, x: 1420, y: 560 },
  { t: 6.2, x: 1380, y: 680 },
]);

const PROMO_CARDS = [
  { idx: '01', name: 'Nuboplan', desc: 'Workspace management platform — Jira/Notion-style collaboration.', chips: ['React.js', 'REST APIs'] },
  { idx: '02', name: 'Earth & Ink', desc: 'CMS-driven blog in Next.js — shipped in under 5 days with AI.', chips: ['Next.js'] },
  { idx: '03', name: 'Yorl.io Console', desc: 'Developer platform — intuitive workflows over complex ops.', chips: ['React.js', 'REST APIs'] },
];

function TiltCard({ card, cx, cy, w, h, cursor, enter }) {
  // Magnetic tilt: same math as the live site
  const dx = clamp((cursor.x - cx) / (w / 2), -1.4, 1.4);
  const dy = clamp((cursor.y - cy) / (h / 2), -1.4, 1.4);
  const inside = Math.abs(dx) < 1.25 && Math.abs(dy) < 1.25;
  const rx = inside ? -dy * 7 : 0;
  const ry = inside ? dx * 8 : 0;
  const lift = inside ? -10 : 0;
  const ef = Easing.easeOutBack(clamp(enter, 0, 1));

  return (
    <div style={{
      position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h,
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${lift + (1 - ef) * 60}px) scale(${0.7 + 0.3 * ef})`,
      opacity: clamp(enter / 0.5, 0, 1),
      background: PV.surface,
      border: `1.5px solid ${inside ? PV.accent : PV.line}`,
      borderRadius: 20, padding: '26px 30px',
      boxShadow: inside ? '0 30px 60px rgba(108,160,220,0.22)' : '0 12px 30px rgba(22,24,29,0.07)',
      transition: 'border-color 0.2s',
    }}>
      <div style={{
        height: 150, borderRadius: 12, marginBottom: 22,
        background: `repeating-linear-gradient(135deg, #eef2f7 0 12px, #e3eaf3 12px 24px)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: PV.mono, fontSize: 15, color: PV.accentInk, letterSpacing: '0.1em',
      }}>{card.name.toUpperCase()}</div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
        <span style={{ fontFamily: PV.mono, fontSize: 16, color: PV.accentInk }}>{card.idx}</span>
        <span style={{ fontFamily: PV.display, fontWeight: 700, fontSize: 28, color: PV.ink }}>{card.name}</span>
      </div>
      <div style={{
        fontFamily: PV.display, fontSize: 18.5, lineHeight: 1.55, color: PV.inkSoft,
        marginTop: 12,
      }}>{card.desc}</div>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        {card.chips.map((c) => (
          <span key={c} style={{
            fontFamily: PV.mono, fontSize: 15, padding: '6px 16px',
            border: `1px solid ${PV.line}`, borderRadius: 999, color: PV.inkSoft,
            background: PV.surface,
          }}>{c}</span>
        ))}
      </div>
    </div>
  );
}

function SceneCards() {
  const { localTime: t, duration } = useSprite();
  const fade = sceneFade(t, duration, 0.4, 0.5);
  const cursor = cardsPath(t);
  const positions = [{ cx: 470, cy: 560 }, { cx: 960, cy: 560 }, { cx: 1450, cy: 560 }];

  return (
    <div style={{ position: 'absolute', inset: 0, background: PV.bg, opacity: fade }}>
      <div style={{
        position: 'absolute', left: 110, top: 120,
        fontFamily: PV.mono, fontSize: 20, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: PV.accentInk,
        opacity: clamp(t / 0.4, 0, 1),
      }}>{'// Selected work'}</div>

      {PROMO_CARDS.map((card, i) => (
        <TiltCard key={card.name} card={card}
                  cx={positions[i].cx} cy={positions[i].cy} w={440} h={440}
                  cursor={cursor} enter={(t - 0.25 - i * 0.18) / 0.6} />
      ))}

      <CaptionChip text="3D tilt on project cards" show={(t - 1.4) / 0.5} />
      <PromoCursor pathFn={cardsPath} time={t} />
    </div>
  );
}

// ── Scene 4: Magnetic contact links ─────────────────────────────────────
const magPath = makePath([
  { t: 0.0, x: 1750, y: 150 },
  { t: 1.0, x: 1180, y: 425 },
  { t: 1.9, x: 700, y: 445 },
  { t: 2.8, x: 1250, y: 600 },
  { t: 3.6, x: 820, y: 620 },
  { t: 4.4, x: 1300, y: 780 },
]);

const PROMO_LINKS = [
  { label: 'Email', value: 'arvindprajapati2569@gmail.com', y: 380 },
  { label: 'LinkedIn', value: 'in/arvind-prajapati', y: 555 },
  { label: 'GitHub', value: 'github.com/ArvindiGit', y: 730 },
];

function SceneMagnetic() {
  const { localTime: t, duration } = useSprite();
  const fade = sceneFade(t, duration, 0.4, 0.5);
  const cursor = magPath(t);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PV.bg, opacity: fade }}>
      <div style={{
        position: 'absolute', left: 410, top: 170,
        fontFamily: PV.display, fontWeight: 700, fontSize: 64,
        letterSpacing: '-0.02em', color: PV.ink,
        opacity: clamp(t / 0.5, 0, 1),
      }}>Let's build something that works.</div>

      {PROMO_LINKS.map((link, i) => {
        const rowCx = 960, rowCy = link.y + 62;
        const dx = (cursor.x - rowCx) / 550;
        const dy = (cursor.y - rowCy) / 62;
        const near = Math.abs(dx) < 1 && Math.abs(dy) < 1;
        const pullX = near ? dx * 14 : 0;
        const pullY = near ? dy * 8 : 0;
        const ef = Easing.easeOutCubic(clamp((t - 0.3 - i * 0.15) / 0.5, 0, 1));
        return (
          <div key={link.label} style={{
            position: 'absolute', left: 410, top: link.y, width: 1100, height: 124,
            display: 'grid', gridTemplateColumns: '220px 1fr auto', alignItems: 'center',
            borderTop: `1.5px solid ${PV.line}`,
            borderBottom: i === PROMO_LINKS.length - 1 ? `1.5px solid ${PV.line}` : 'none',
            transform: `translate(${pullX}px, ${pullY}px)`,
            opacity: ef,
            paddingLeft: near ? 18 : 4,
            transition: 'padding-left 0.25s',
          }}>
            <span style={{
              fontFamily: PV.mono, fontSize: 17, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: PV.inkFaint,
            }}>{link.label}</span>
            <span style={{
              fontFamily: PV.display, fontWeight: 500, fontSize: 30,
              color: near ? PV.accentInk : PV.ink, transition: 'color 0.25s',
            }}>{link.value}</span>
            <span style={{
              fontFamily: PV.mono, fontSize: 28,
              color: near ? PV.accentInk : PV.inkFaint,
              transform: `translateX(${near ? 8 : 0}px)`, transition: 'transform 0.25s',
            }}>→</span>
          </div>
        );
      })}

      <CaptionChip text="Magnetic contact links" show={(t - 1.2) / 0.5} />
      <PromoCursor pathFn={magPath} time={t} />
    </div>
  );
}

// ── Scene 5: Dark mode wipe + accent cycling ────────────────────────────
const darkPath = makePath([
  { t: 0.0, x: 1750, y: 950 },
  { t: 1.1, x: 1700, y: 170 },
  { t: 3.2, x: 1690, y: 175 },
  { t: 4.2, x: 1100, y: 600 },
]);

const ACCENTS = ['#6CA0DC', '#1F8A5B', '#D97757', '#7A5AE0'];

function HeroMini({ dark, accent }) {
  const ink = dark ? PV.darkInk : PV.ink;
  const soft = dark ? PV.darkSoft : PV.inkSoft;
  return (
    <div style={{ position: 'absolute', inset: 0, background: dark ? PV.darkBg : PV.bg }}>
      <MiniSidebar t={99} dark={dark} />
      <div style={{
        position: 'absolute', left: 560, top: 150,
        fontFamily: PV.mono, fontSize: 20, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: dark ? accent : PV.accentInk,
      }}>{'// About me'}</div>
      <div style={{
        position: 'absolute', left: 560, top: 230, width: 1050,
        fontFamily: PV.display, fontWeight: 700, fontSize: 86,
        letterSpacing: '-0.025em', lineHeight: 1.08, color: ink,
      }}>
        I build clean, working software — and I <span style={{ color: accent }}>think with AI.</span>
      </div>
      <div style={{
        position: 'absolute', left: 560, top: 600, width: 820,
        fontFamily: PV.display, fontSize: 27, lineHeight: 1.6, color: soft,
      }}>
        Software engineer with ~2 years of hands-on experience building
        production web apps in React and JavaScript.
      </div>
    </div>
  );
}

function SceneDark() {
  const { localTime: t, duration } = useSprite();
  const fade = sceneFade(t, duration, 0.4, 0.5);
  const cursor = darkPath(t);

  // Toggle pill at top-right; click at t=1.4 triggers circular wipe
  const CLICK = 1.4;
  const wipe = Easing.easeInOutCubic(clamp((t - CLICK) / 0.9, 0, 1));
  const r = wipe * 2300;
  const isOn = t > CLICK;

  // Accent cycles after the wipe
  const accentIdx = t > 2.6 ? Math.min(ACCENTS.length - 1, Math.floor((t - 2.6) / 0.65)) : 0;
  const accent = ACCENTS[accentIdx % ACCENTS.length];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fade }}>
      <HeroMini dark={false} accent={PV.accent} />
      <div style={{
        position: 'absolute', inset: 0,
        clipPath: `circle(${r}px at 1690px 175px)`,
      }}>
        <HeroMini dark={true} accent={accent} />
      </div>

      {/* Theme toggle pill */}
      <div style={{
        position: 'absolute', left: 1640, top: 150, width: 104, height: 52,
        borderRadius: 999, border: `1.5px solid ${isOn ? PV.darkLine : PV.line}`,
        background: isOn ? PV.darkSurface : PV.surface,
        boxShadow: '0 6px 18px rgba(22,24,29,0.12)', zIndex: 10,
      }}>
        <div style={{
          position: 'absolute', top: 5,
          left: 5 + (isOn ? 52 : 0) * 1,
          width: 40, height: 40, borderRadius: '50%',
          background: isOn ? accent : '#f5bd4f',
          transition: 'left 0.35s cubic-bezier(0.22,1,0.36,1), background 0.35s',
        }}></div>
      </div>

      {/* Accent swatch row appears during cycling */}
      {t > 2.5 && (
        <div style={{
          position: 'absolute', left: 560, top: 770, display: 'flex', gap: 16,
          opacity: clamp((t - 2.5) / 0.4, 0, 1), zIndex: 10,
        }}>
          {ACCENTS.map((c, i) => (
            <span key={c} style={{
              width: 44, height: 44, borderRadius: '50%', background: c,
              border: i === accentIdx ? `3px solid ${PV.darkInk}` : '3px solid transparent',
              boxShadow: i === accentIdx ? `0 0 0 3px ${c}55` : 'none',
              transform: `scale(${i === accentIdx ? 1.15 : 1})`,
              transition: 'transform 0.25s',
            }}></span>
          ))}
        </div>
      )}

      <CaptionChip text="Dark mode + live tweaks" show={(t - 2.3) / 0.5} dark={isOn} />
      <PromoCursor pathFn={darkPath} time={t} clicks={[CLICK]} accent={accent} />
    </div>
  );
}

// ── Scene 6: Outro ──────────────────────────────────────────────────────
function SceneOutro() {
  const { localTime: t, duration } = useSprite();
  const fade = sceneFade(t, duration, 0.5, 0.6);
  const f1 = Easing.easeOutCubic(clamp((t - 0.2) / 0.6, 0, 1));
  const f2 = Easing.easeOutCubic(clamp((t - 0.6) / 0.6, 0, 1));
  const f3 = Easing.easeOutCubic(clamp((t - 1.1) / 0.6, 0, 1));
  const f4 = Easing.easeOutBack(clamp((t - 1.7) / 0.6, 0, 1));
  const drift = 1 + 0.015 * Easing.easeInOutSine(clamp(t / duration, 0, 1));

  return (
    <div style={{ position: 'absolute', inset: 0, background: PV.darkBg, opacity: fade }}>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 0,
        transform: `scale(${drift})`,
      }}>
        <div style={{
          width: 180, height: 180, borderRadius: '50%', overflow: 'hidden',
          border: `3px solid ${PV.accent}`, boxShadow: `0 0 0 8px rgba(108,160,220,0.12)`,
          opacity: f1, transform: `translateY(${(1 - f1) * 30}px)`,
        }}>
          <img src="images/arvind.jpeg" alt="Arvind Prajapati"
               style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{
          fontFamily: PV.display, fontWeight: 700, fontSize: 76,
          letterSpacing: '-0.02em', color: PV.darkInk, marginTop: 36,
          opacity: f2, transform: `translateY(${(1 - f2) * 24}px)`,
        }}>Arvind Prajapati</div>
        <div style={{
          fontFamily: PV.mono, fontSize: 24, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: PV.accent, marginTop: 16,
          opacity: f2,
        }}>&gt; Software Engineer</div>
        <div style={{
          fontFamily: PV.mono, fontSize: 22, color: PV.darkSoft, marginTop: 40,
          display: 'flex', gap: 36, opacity: f3,
        }}>
          <span>github.com/ArvindiGit</span>
          <span style={{ color: '#3a4049' }}>·</span>
          <span>in/arvind-prajapati</span>
        </div>
        <div style={{
          marginTop: 52, padding: '20px 52px', borderRadius: 999,
          background: PV.accent, color: '#0e1116',
          fontFamily: PV.display, fontWeight: 700, fontSize: 28,
          opacity: f4, transform: `scale(${0.8 + 0.2 * f4})`,
          boxShadow: '0 16px 50px rgba(108,160,220,0.35)',
        }}>Portfolio link in bio →</div>
      </div>
    </div>
  );
}

// ── Root composition ────────────────────────────────────────────────────
function PromoVideo() {
  const time = useTime();
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    if (rootRef.current) {
      rootRef.current.setAttribute('data-screen-label', 't=' + Math.floor(time) + 's');
    }
  }, [Math.floor(time)]);

  return (
    <div ref={rootRef} style={{ position: 'absolute', inset: 0 }} data-screen-label="t=0s">
      <Sprite start={0} end={4.5}><SceneTerminal /></Sprite>
      <Sprite start={4.5} end={11}><SceneHero /></Sprite>
      <Sprite start={11} end={17.5}><SceneCards /></Sprite>
      <Sprite start={17.5} end={22.5}><SceneMagnetic /></Sprite>
      <Sprite start={22.5} end={27.5}><SceneDark /></Sprite>
      <Sprite start={27.5} end={33}><SceneOutro /></Sprite>
    </div>
  );
}

const promoRoot = document.getElementById('promo-root');
ReactDOM.createRoot(promoRoot).render(
  <Stage width={1920} height={1080} duration={33} background={PV.bg} persistKey="promo-video">
    <PromoVideo />
  </Stage>
);
