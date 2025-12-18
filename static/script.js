// ===== CANVAS BACKGROUND =====
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const words = [
  "FILES","UPLOAD","S3","BACKEND","API","FASTAPI","CLOUD",
  "LOGS","RECORDS","DATA","STORAGE","SECURE","PIPELINE",
  "SERVER","DEPLOY","NODE","PYTHON","LINUX","DEVOPS"
];

const nodes = Array.from({ length: 80 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.6,
  vy: (Math.random() - 0.5) * 0.6,
  text: words[Math.floor(Math.random() * words.length)]
}));

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  nodes.forEach((n, i) => {
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

    ctx.fillStyle = "orange";
    ctx.font = "16px monospace";
    ctx.fillText(n.text, n.x, n.y);

    nodes.forEach((m, j) => {
      const dx = n.x - m.x;
      const dy = n.y - m.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.strokeStyle = "rgba(255,165,0,0.3)";
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

// ===== FILE UPLOAD =====
const input = document.getElementById("fileInput");
const status = document.getElementById("status");

input.addEventListener("change", async () => {
  const file = input.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  status.innerText = "Uploading...";

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    status.innerText = data.message;
  } catch {
    status.innerText = "Upload failed";
  }
});
