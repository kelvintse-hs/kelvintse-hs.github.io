(() => {
  const canvas = document.getElementById("bb-canvas");
  const slider = document.getElementById("bb-speed");
  const out = document.getElementById("bb-speed-out");
  const ctx = canvas.getContext("2d", { alpha: false });

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  let x = 40,
    y = 40;
  let vx = 1,
    vy = 0.8;
  const radius = 14;
  const baseSpeed = 160;
  let speedScale = parseFloat(slider.value);

  function updateSpeedLabel() {
    out.textContent = `${Number(speedScale).toFixed(1)}×`;
  }
  slider.addEventListener("input", () => {
    speedScale = parseFloat(slider.value);
    updateSpeedLabel();
  });
  updateSpeedLabel();

  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;

    const speed = baseSpeed * speedScale;
    x += vx * speed * dt;
    y += vy * speed * dt;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (x - radius < 0) {
      x = radius;
      vx = Math.abs(vx);
    }
    if (x + radius > w) {
      x = w - radius;
      vx = -Math.abs(vx);
    }
    if (y - radius < 0) {
      y = radius;
      vy = Math.abs(vy);
    }
    if (y + radius > h) {
      y = h - radius;
      vy = -Math.abs(vy);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(x + 2, y + 6, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(15,23,42,0.12)";
    ctx.fill();

    const grd = ctx.createRadialGradient(
      x - radius / 3,
      y - radius / 3,
      radius / 3,
      x,
      y,
      radius
    );
    grd.addColorStop(0, "#22d3ee");
    grd.addColorStop(1, "#0ea5e9");
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x - radius / 2.5, y - radius / 2.5, radius / 3.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fill();

    requestAnimationFrame(tick);
  }

  const ro = new ResizeObserver(() => resizeCanvas());
  ro.observe(canvas.parentElement);
  window.addEventListener("orientationchange", resizeCanvas, { passive: true });

  resizeCanvas();
  requestAnimationFrame((t) => {
    last = t;
    tick(t);
  });
})();
