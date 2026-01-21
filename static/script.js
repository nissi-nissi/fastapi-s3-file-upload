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
  "PIPELINE","DATABASE","DEVOPS","PYTHON","REQUEST","RESPONSE"
];

const nodes = Array.from({ length: 100 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.3,
  vy: (Math.random() - 0.5) * 0.3,
  text: terms[Math.floor(Math.random() * terms.length)]
}));

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

    ctx.fillStyle = "rgba(255,140,0,0.7)";
    ctx.font = "14px monospace";
    ctx.fillText(n.text, n.x, n.y);

    nodes.forEach(m => {
      const dx = n.x - m.x;
      const dy = n.y - m.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        ctx.strokeStyle = "rgba(255,140,0,0.25)";
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

// ================= UPLOAD =================
const fileInput = document.getElementById("fileInput");
const status = document.getElementById("status");

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  status.textContent = "Uploading...";

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    status.textContent = "Uploaded: " + data.filename;
  } catch {
    status.textContent = "Upload failed";
  }
});
