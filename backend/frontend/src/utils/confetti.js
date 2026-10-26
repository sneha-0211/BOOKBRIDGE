// Lightweight Canvas Confetti Generator for BOOKBRIDGE AI
// Zero external dependencies, pure HTML5 Canvas

export function fireConfetti(options = {}) {
  if (typeof window === 'undefined') return;

  const count = options.count || 80;
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const colors = [
    '#147D64', // Emerald
    '#2357A5', // Sapphire
    '#F2B544', // Warm Gold
    '#10B981', // Mint
    '#3B82F6', // Blue
    '#F59E0B', // Amber
    '#EC4899', // Rose
    '#8B5CF6'  // Purple
  ];

  const originX = options.x !== undefined ? options.x : width / 2;
  const originY = options.y !== undefined ? options.y : height * 0.4;

  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 8 + Math.random() * 14;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 4,
      size: 5 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.3 ? 'rect' : 'circle',
      gravity: 0.35 + Math.random() * 0.15,
      friction: 0.96
    });
  }

  let animationFrameId;
  const startTime = Date.now();
  const maxDuration = 2800; // 2.8 seconds

  function render() {
    const elapsed = Date.now() - startTime;
    if (elapsed > maxDuration) {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      return;
    }

    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - (elapsed / maxDuration));

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}
