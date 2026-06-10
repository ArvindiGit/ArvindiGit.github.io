// iv-scenes.jsx — the six scenes of Arvind's intro video
// Exports to window: IVFilm

// ── Scene 1 · whoami → name reveal (0–6.5s) ─────────────────────────────────
function IVSceneWhoami() {
  return (
    <div>
      <IVTypedCommand cmd="whoami" start={0.8} cps={11}></IVTypedCommand>
      <IVReveal at={1.9} dy={8} style={{ marginTop: 14 }}>
        <div style={{ fontFamily: IV_MONO, fontSize: 28, color: IV_COLORS.dim }}>arvind_prajapati</div>
      </IVReveal>
      <IVReveal at={2.6} dy={26} dur={0.6} style={{ marginTop: 76 }}>
        <div style={{
          fontFamily: IV_MONO, fontSize: 108, fontWeight: 800, lineHeight: 1.08,
          color: IV_COLORS.text, letterSpacing: '-0.02em',
        }}>
          ARVIND<br></br>PRAJAPATI
        </div>
      </IVReveal>
      <Sprite start={3.3} end={99} keepMounted={false}>
        {({ localTime }) => {
          const w = animate({ from: 0, to: 380, start: 0, end: 0.55, ease: Easing.easeOutCubic })(localTime);
          return <div style={{ marginTop: 36, height: 6, width: w, background: 'var(--iv-accent)', boxShadow: '0 0 26px color-mix(in oklab, var(--iv-accent) 60%, transparent)' }}></div>;
        }}
      </Sprite>
      <div style={{ marginTop: 34 }}>
        <IVSceneTyped at={4.0} text="> SOFTWARE_ENGINEER" size={40} color="var(--iv-accent)" cps={20} letterSpacing="0.18em"></IVSceneTyped>
      </div>
    </div>
  );
}

// typed line (not a command — no prompt)
function IVSceneTyped({ text, at = 0, cps = 22, size = 32, color = IV_COLORS.text, letterSpacing = '0' }) {
  const { localTime } = useSprite();
  if (localTime < at) return null;
  const { typed, typing } = useIVTyped(text, localTime, at, cps);
  return (
    <div style={{ fontFamily: IV_MONO, fontSize: size, color, whiteSpace: 'pre', letterSpacing, fontWeight: 700 }}>
      {typed}{typing ? <IVCursor solid={true} color={color}></IVCursor> : null}
    </div>
  );
}

// ── Scene 2 · profile (6.5–13.5s) ───────────────────────────────────────────
function IVSceneProfile() {
  const line = { fontFamily: IV_MONO, fontSize: 36, lineHeight: 1.6, color: IV_COLORS.text };
  return (
    <div>
      <IVTypedCommand cmd="cat ./profile.txt" start={0.3} cps={17}></IVTypedCommand>
      <div style={{ marginTop: 56 }}>
        <IVSectionTag num="01" label="PROFILE" at={1.7}></IVSectionTag>
        <IVReveal at={2.3} style={{ marginBottom: 26 }}>
          <div style={line}>
            <span style={{ color: IV_COLORS.green }}>›</span> nearly <span style={{ color: 'var(--iv-accent)', fontWeight: 700 }}>2 years</span> building production web apps
          </div>
        </IVReveal>
        <IVReveal at={3.4} style={{ marginBottom: 26 }}>
          <div style={line}>
            <span style={{ color: IV_COLORS.green }}>›</span> front-end focus — <span style={{ color: 'var(--iv-accent)', fontWeight: 700 }}>React</span> · <span style={{ color: 'var(--iv-accent)', fontWeight: 700 }}>JavaScript</span>
          </div>
        </IVReveal>
        <IVReveal at={4.5}>
          <div style={line}>
            <span style={{ color: IV_COLORS.green }}>›</span> collaborative, deadline-driven, dependable
          </div>
        </IVReveal>
      </div>
    </div>
  );
}

// ── Scene 3 · stack (13.5–21s) ──────────────────────────────────────────────
function IVSceneStack() {
  const groupLabel = { fontFamily: IV_MONO, fontSize: 24, letterSpacing: '0.3em', color: IV_COLORS.dim, marginBottom: 18 };
  const row = { display: 'flex', gap: 16, flexWrap: 'wrap' };
  return (
    <div>
      <IVTypedCommand cmd="ls ./stack" start={0.3} cps={17}></IVTypedCommand>
      <div style={{ marginTop: 52 }}>
        <IVSectionTag num="02" label="STACK" at={1.4}></IVSectionTag>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '46px 60px', marginTop: 10 }}>
          <div>
            <IVReveal at={2.0} dy={10}><div style={groupLabel}>LANGUAGES</div></IVReveal>
            <div style={row}>
              <IVChip label="JavaScript" at={2.2} accent={true}></IVChip>
              <IVChip label="HTML" at={2.35}></IVChip>
              <IVChip label="CSS" at={2.5}></IVChip>
            </div>
          </div>
          <div>
            <IVReveal at={2.8} dy={10}><div style={groupLabel}>FRAMEWORKS</div></IVReveal>
            <div style={row}>
              <IVChip label="React.js" at={3.0} accent={true}></IVChip>
              <IVChip label="Next.js" at={3.15} accent={true}></IVChip>
            </div>
          </div>
          <div>
            <IVReveal at={3.5} dy={10}><div style={groupLabel}>ALSO WORKED WITH</div></IVReveal>
            <div style={row}>
              <IVChip label="React Native" at={3.7}></IVChip>
              <IVChip label="Node.js" at={3.85}></IVChip>
            </div>
          </div>
          <div>
            <IVReveal at={4.2} dy={10}><div style={groupLabel}>TOOLS &amp; PRACTICES</div></IVReveal>
            <div style={row}>
              <IVChip label="Git" at={4.4}></IVChip>
              <IVChip label="GitHub" at={4.55}></IVChip>
              <IVChip label="Code Review" at={4.7}></IVChip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Scene 4 · experience (21–28.5s) ─────────────────────────────────────────
function IVSceneWork() {
  const bullet = { fontFamily: IV_MONO, fontSize: 31, lineHeight: 1.55, color: IV_COLORS.text };
  return (
    <div>
      <IVTypedCommand cmd="git log --work" start={0.3} cps={17}></IVTypedCommand>
      <div style={{ marginTop: 50 }}>
        <IVSectionTag num="03" label="EXPERIENCE" at={1.5}></IVSectionTag>
        <IVReveal at={2.1} style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: IV_MONO, fontSize: 27, color: IV_COLORS.yellow }}>
            commit jul.2024 → may.2026 <span style={{ color: IV_COLORS.faint }}>(HEAD)</span>
          </div>
        </IVReveal>
        <IVReveal at={2.5} style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: IV_MONO, fontSize: 52, fontWeight: 800, color: IV_COLORS.text }}>
            Software Engineer Trainee
          </div>
        </IVReveal>
        <IVReveal at={2.9} style={{ marginBottom: 42 }}>
          <div style={{ fontFamily: IV_MONO, fontSize: 30, color: IV_COLORS.dim }}>
            Techindo Systems Pvt. Ltd. · Navi Mumbai
          </div>
        </IVReveal>
        <IVReveal at={3.6} style={{ marginBottom: 20 }}>
          <div style={bullet}><span style={{ color: IV_COLORS.green }}>+</span> built responsive UIs in React &amp; JavaScript</div>
        </IVReveal>
        <IVReveal at={4.4} style={{ marginBottom: 20 }}>
          <div style={bullet}><span style={{ color: IV_COLORS.green }}>+</span> delivered independently, always on deadline</div>
        </IVReveal>
        <IVReveal at={5.2}>
          <div style={bullet}><span style={{ color: IV_COLORS.green }}>+</span> Git · GitHub · code review with the team</div>
        </IVReveal>
      </div>
    </div>
  );
}

// ── Scene 5 · AI hero (28.5–38.5s) ──────────────────────────────────────────
function IVSceneAI() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
      <IVReveal at={0.3} dy={10} style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: IV_MONO, fontSize: 26, letterSpacing: '0.35em', color: IV_COLORS.dim }}>
          <span style={{ color: 'var(--iv-accent)' }}>{'>'}</span>_ WHAT DRIVES ME
        </div>
      </IVReveal>
      <IVSceneTyped at={0.9} text="I don't just build with AI —" size={64} cps={24} color={IV_COLORS.text}></IVSceneTyped>
      <div style={{ marginTop: 24 }}>
        <Sprite start={2.6} end={99}>
          {({ localTime }) => {
            const t = Easing.easeOutCubic(clamp(localTime / 0.5, 0, 1));
            return (
              <div style={{
                fontFamily: IV_MONO, fontSize: 92, fontWeight: 800,
                color: 'var(--iv-accent)',
                opacity: t,
                transform: `translateY(${(1 - t) * 24}px)`,
                textShadow: '0 0 60px color-mix(in oklab, var(--iv-accent) 45%, transparent)',
              }}>
                I think with it.
              </div>
            );
          }}
        </Sprite>
      </div>
      <IVReveal at={4.6} style={{ marginTop: 64 }}>
        <div style={{ display: 'flex', gap: 18 }}>
          <IVChip label="Claude" at={0} accent={true} size={29}></IVChip>
          <IVChip label="Codex" at={0.15} size={29}></IVChip>
          <IVChip label="Antigravity" at={0.3} size={29}></IVChip>
          <IVChip label="GitHub Copilot" at={0.45} size={29}></IVChip>
        </div>
      </IVReveal>
      <IVReveal at={6.2} style={{ marginTop: 40 }}>
        <div style={{ fontFamily: IV_MONO, fontSize: 28, color: IV_COLORS.dim, lineHeight: 1.6 }}>
          automating the repetitive · mapping roadmaps · sharpening decisions
        </div>
      </IVReveal>
    </div>
  );
}

// ── Scene 6 · connect / outro (38.5–46s) ────────────────────────────────────
function IVSceneConnect() {
  const k = { display: 'inline-block', width: 300, flexShrink: 0, color: IV_COLORS.dim, letterSpacing: '0.2em', fontSize: 26, whiteSpace: 'nowrap' };
  const v = { color: IV_COLORS.text, fontSize: 32, whiteSpace: 'nowrap' };
  const rowStyle = { fontFamily: IV_MONO, lineHeight: 1.5, marginBottom: 26, display: 'flex', alignItems: 'baseline' };
  return (
    <div>
      <IVTypedCommand cmd="./connect.sh" start={0.3} cps={17}></IVTypedCommand>
      <div style={{ marginTop: 56 }}>
        <IVSectionTag num="04" label="CONNECT" at={1.4}></IVSectionTag>
        <IVReveal at={2.0} style={rowStyle}>
          <span style={k}>EMAIL</span><span style={v}>arvindprajapati2569@gmail.com</span>
        </IVReveal>
        <IVReveal at={2.5} style={rowStyle}>
          <span style={k}>GITHUB</span><span style={v}>github.com/<span style={{ color: 'var(--iv-accent)' }}>ArvindiGit</span></span>
        </IVReveal>
        <IVReveal at={3.0} style={rowStyle}>
          <span style={k}>LINKEDIN</span><span style={v}>in/arvind-prajapati</span>
        </IVReveal>
        <IVReveal at={3.5} style={rowStyle}>
          <span style={k}>LOCATION</span><span style={v}>Deoria, Uttar Pradesh</span>
        </IVReveal>
        <IVReveal at={4.6} style={{ marginTop: 60 }}>
          <div style={{ fontFamily: IV_MONO, fontSize: 28, color: IV_COLORS.faint }}>
            <span style={{ color: 'var(--iv-accent)' }}>//</span> thanks for stopping by
          </div>
        </IVReveal>
        <div style={{ marginTop: 30 }}>
          <Sprite start={5.2} end={99}>
            <div style={{ fontFamily: IV_MONO, fontSize: 30, color: IV_COLORS.text }}>
              <span style={{ color: IV_COLORS.green }}>arvind@portfolio</span>
              <span style={{ color: IV_COLORS.faint }}>:~$</span>
              <IVCursor></IVCursor>
            </div>
          </Sprite>
        </div>
      </div>
    </div>
  );
}

// ── Film: full timeline ──────────────────────────────────────────────────────
function IVFilm({ scanlines = true }) {
  const time = useTime();
  return (
    <div data-screen-label={`t=${Math.floor(time)}s`} style={{ position: 'absolute', inset: 0 }}>
      <IVWindow scanlines={scanlines}>
        <IVScene start={0} end={6.5} label="scene-1-whoami"><IVSceneWhoami></IVSceneWhoami></IVScene>
        <IVScene start={6.5} end={13.5} label="scene-2-profile"><IVSceneProfile></IVSceneProfile></IVScene>
        <IVScene start={13.5} end={21} label="scene-3-stack"><IVSceneStack></IVSceneStack></IVScene>
        <IVScene start={21} end={28.5} label="scene-4-experience"><IVSceneWork></IVSceneWork></IVScene>
        <IVScene start={28.5} end={38.5} zoomTo={1.05} label="scene-5-ai"><IVSceneAI></IVSceneAI></IVScene>
        <IVScene start={38.5} end={46} fadeOut={0.01} label="scene-6-connect"><IVSceneConnect></IVSceneConnect></IVScene>
      </IVWindow>
    </div>
  );
}

Object.assign(window, { IVFilm });
