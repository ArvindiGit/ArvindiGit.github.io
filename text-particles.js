// Text particle effect for the hero headline.
// Renders the h1 as ~2k particles on a canvas; particles repel from the
// cursor and spring back home. Honors theme/accent/font tweaks and
// prefers-reduced-motion. Toggle via data-herofx="on|off" on <html>.

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  var h1 = document.querySelector('.hero h1');
  if (!h1) return;

  // Segments of the headline with their color roles.
  var SEGMENTS = [
    { text: 'I build clean, working software \u2014 and I ', role: 'ink' },
    { text: 'think with AI', role: 'accent' },
    { text: '.', role: 'ink' }
  ];

  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;';
  var ctx = canvas.getContext('2d');

  var particles = [];
  var raf = null;
  var visible = true;
  var active = false;
  var mouse = { x: -9999, y: -9999 };
  var DPR = Math.min(2, window.devicePixelRatio || 1);

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function parseColor(str) {
    // Returns [r,g,b] from #hex or rgb() strings.
    if (str[0] === '#') {
      var n = parseInt(str.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    var m = str.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    return m ? [+m[1], +m[2], +m[3]] : [22, 24, 29];
  }

  function build() {
    var cs = getComputedStyle(h1);
    var fontSize = parseFloat(cs.fontSize);
    var lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.08;
    var font = cs.fontWeight + ' ' + fontSize + 'px ' + cs.fontFamily;
    var maxW = h1.clientWidth;

    // --- lay out words with greedy wrap, tracking color roles ---
    var words = [];
    SEGMENTS.forEach(function (seg) {
      seg.text.split(/(\s+)/).forEach(function (tok) {
        if (tok.length) words.push({ t: tok, role: seg.role });
      });
    });

    var off = document.createElement('canvas');
    var octx = off.getContext('2d');
    octx.font = font;
    if ('letterSpacing' in octx) octx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;

    var lines = [[]];
    var lineW = 0;
    words.forEach(function (w) {
      var wW = octx.measureText(w.t).width;
      if (lineW + wW > maxW && lineW > 0 && w.t.trim() !== '') {
        lines.push([]);
        lineW = 0;
        if (w.t.trim() === '') return; // don't lead lines with spaces
      }
      lines[lines.length - 1].push(w);
      lineW += wW;
    });

    var totalH = Math.ceil(lines.length * lineHeight);
    off.width = Math.ceil(maxW * DPR);
    off.height = Math.ceil(totalH * DPR);
    octx.scale(DPR, DPR);
    octx.font = font;
    if ('letterSpacing' in octx) octx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
    octx.textBaseline = 'alphabetic';

    // Draw: ink-role text in red channel marker, accent in green channel marker
    lines.forEach(function (line, li) {
      var x = 0;
      var y = li * lineHeight + fontSize * 0.86;
      line.forEach(function (w) {
        octx.fillStyle = w.role === 'accent' ? '#00ff00' : '#ff0000';
        octx.fillText(w.t, x, y);
        x += octx.measureText(w.t).width;
      });
    });

    // --- sample pixels into particles ---
    var gap = Math.max(3, Math.round(fontSize / 16)) * DPR;
    var data = octx.getImageData(0, 0, off.width, off.height).data;
    particles = [];
    for (var py = 0; py < off.height; py += gap) {
      for (var px = 0; px < off.width; px += gap) {
        var idx = (py * off.width + px) * 4;
        if (data[idx + 3] > 128) {
          var hx = px / DPR, hy = py / DPR;
          particles.push({
            hx: hx, hy: hy,
            x: hx + (Math.random() - 0.5) * 160,
            y: hy + (Math.random() - 0.5) * 120,
            vx: 0, vy: 0,
            r: (0.9 + Math.random() * 0.9) * (gap / DPR) * 0.42,
            role: data[idx + 1] > 128 ? 'accent' : 'ink',
            ph: Math.random() * Math.PI * 2
          });
        }
      }
    }

    // size the visible canvas
    h1.style.position = 'relative';
    h1.style.textWrap = 'initial'; // match greedy wrap so heights agree
    canvas.width = off.width;
    canvas.height = off.height;
    canvas.style.width = maxW + 'px';
    canvas.style.height = totalH + 'px';
    if (!canvas.parentNode) h1.appendChild(canvas);
  }

  var t = 0;
  function tick() {
    raf = null;
    if (!visible || !active) return;
    t += 0.016;

    var inkC = parseColor(cssVar('--ink'));
    var accC = parseColor(cssVar('--accent-ink') || cssVar('--accent'));
    var rect = canvas.getBoundingClientRect();
    var mx = mouse.x - rect.left;
    var my = mouse.y - rect.top;

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var R = 90; // repel radius
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var dx = p.x - mx, dy = p.y - my;
      var d2 = dx * dx + dy * dy;
      if (d2 < R * R && d2 > 0.01) {
        var d = Math.sqrt(d2);
        var f = (1 - d / R) * 7;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }
      // spring home
      p.vx += (p.hx - p.x) * 0.045;
      p.vy += (p.hy - p.y) * 0.045;
      p.vx *= 0.86;
      p.vy *= 0.86;
      p.x += p.vx;
      p.y += p.vy;

      var c = p.role === 'accent' ? accC : inkC;
      // particles displaced from home glow slightly
      var disp = Math.min(1, (Math.abs(p.x - p.hx) + Math.abs(p.y - p.hy)) / 40);
      var alpha = 0.92 - disp * 0.25;
      ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha.toFixed(3) + ')';
      ctx.beginPath();
      var wob = Math.sin(t * 1.4 + p.ph) * 0.25;
      ctx.arc(p.x + wob, p.y + wob, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (!raf && visible && active) raf = requestAnimationFrame(tick);
  }

  function enable() {
    if (active) return;
    active = true;
    document.fonts.ready.then(function () {
      build();
      h1.style.color = 'transparent';
      var em = h1.querySelector('em');
      if (em) em.style.color = 'transparent';
      canvas.style.display = '';
      start();
    });
  }

  function disable() {
    active = false;
    canvas.style.display = 'none';
    h1.style.color = '';
    h1.style.textWrap = '';
    var em = h1.querySelector('em');
    if (em) em.style.color = '';
  }

  function syncFromAttr() {
    var v = document.documentElement.getAttribute('data-herofx');
    if (v === 'off') disable();
    else enable();
  }

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    start();
  }, { passive: true });

  // pause when offscreen
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    start();
  }, { threshold: 0 }).observe(h1);

  // rebuild on resize
  var rT;
  window.addEventListener('resize', function () {
    clearTimeout(rT);
    rT = setTimeout(function () { if (active) { build(); start(); } }, 180);
  }, { passive: true });

  // rebuild colors/fonts when tweaks change html attributes
  new MutationObserver(function (muts) {
    var fontsChanged = muts.some(function (m) { return m.attributeName === 'data-fonts' || m.attributeName === 'data-density'; });
    syncFromAttr();
    if (active && fontsChanged) {
      document.fonts.ready.then(function () { build(); start(); });
    }
    start();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-fonts', 'data-density', 'data-herofx', 'style'] });

  syncFromAttr();
})();
