/* Lightweight animated peptide-chain background. Pauses when hidden and
 * renders a single static frame when the user prefers reduced motion. */
(function () {
  "use strict";
  var c = document.getElementById("bg-canvas");
  if (!c || !c.getContext) return;
  var ctx = c.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W, H, chains = [], raf = null, t = 0;
  function rand(a, b) { return a + Math.random() * (b - a); }
  function build() {
    W = c.width = Math.floor(innerWidth * dpr); H = c.height = Math.floor(innerHeight * dpr);
    c.style.width = innerWidth + "px"; c.style.height = innerHeight + "px";
    var n = innerWidth < 640 ? 3 : 6; chains = [];
    for (var k = 0; k < n; k++) {
      var len = Math.floor(rand(7, 13)), pts = [];
      for (var i = 0; i < len; i++) pts.push({ ph: rand(0, 6.28), r: rand(2.2, 4.2) * dpr, hue: Math.random() < 0.7 ? 186 : 168 });
      chains.push({ x: rand(0, W), y: rand(0, H), ang: rand(0, 6.28), step: rand(26, 38) * dpr, vx: rand(-0.12, 0.12) * dpr, vy: rand(-0.08, 0.08) * dpr, pts: pts, amp: rand(6, 14) * dpr, spin: rand(-0.0006, 0.0006) });
    }
  }
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (var k = 0; k < chains.length; k++) {
      var ch = chains[k], prev = null;
      ch.x += ch.vx; ch.y += ch.vy; ch.ang += ch.spin;
      if (ch.x < -300 * dpr) ch.x = W + 200 * dpr; if (ch.x > W + 300 * dpr) ch.x = -200 * dpr;
      if (ch.y < -300 * dpr) ch.y = H + 200 * dpr; if (ch.y > H + 300 * dpr) ch.y = -200 * dpr;
      var ca = Math.cos(ch.ang), sa = Math.sin(ch.ang);
      for (var i = 0; i < ch.pts.length; i++) {
        var p = ch.pts[i], off = Math.sin(t * 0.001 + p.ph + i * 0.9) * ch.amp;
        var lx = (i - ch.pts.length / 2) * ch.step, ly = off + (i % 2 ? 10 : -10) * dpr;
        var x = ch.x + lx * ca - ly * sa, y = ch.y + lx * sa + ly * ca;
        if (prev) {
          ctx.strokeStyle = "rgba(56,232,255,0.16)"; ctx.lineWidth = 1.2 * dpr;
          ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(x, y); ctx.stroke();
        }
        ctx.fillStyle = "hsla(" + p.hue + ",95%,62%,0.55)";
        ctx.shadowColor = "hsla(" + p.hue + ",95%,60%,0.9)"; ctx.shadowBlur = 10 * dpr;
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
        prev = { x: x, y: y };
      }
    }
    t += 16;
    if (!reduce) raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf) { raf = requestAnimationFrame(frame); } }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }
  build();
  if (reduce) frame(); else start();
  var rt; addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { build(); if (reduce) frame(); }, 150); });
  document.addEventListener("visibilitychange", function () { if (reduce) return; document.hidden ? stop() : start(); });
})();
