// ================= CANVAS =================
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ================= WORDS =================
const terms = [
  "FILES","UPLOAD","API","FASTAPI","S3","CLOUD","LOGS","DATA",
  "BACKEND","SERVER","STORAGE","DEPLOY","LINUX","SECURITY",
  "PIPELINE","DATABASE","DEVOPS","PYTHON","REQUEST","RESPONSE",
  "AUTH","QUEUE","CACHE","MONITOR","TRACE","CONFIG","NETWORK"
];

const nodes = Array.from({ length: 100 }, () => ({
  x: Math.random() * innerWidth,
  y: Math.random() * innerHeight,
  z: Math.random() * 1 + 0.3,   // depth
  vx: (Math.random() - 0.5) * 0.35,
  vy: (Math.random() - 0.5) * 0.35,
  text: terms[Math.floor(Math.random() * terms.length)]
}));

// ================= ANIMATION =================
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

    // draw word
    ctx.fillStyle = "rgba(255, 165, 0, 0.75)";
    ctx.font = `${14 * n.z}px monospace`;
    ctx.fillText(n.text, n.x, n.y);

    // connections
    nodes.forEach(m => {
      const dx = n.x - m.x;
      const dy = n.y - m.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 170) {
        ctx.strokeStyle = "rgba(255, 165, 0, 0.22)";
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(animate);
}

animate();
