// ==========================
// CANVAS BACKGROUND
// ==========================
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const WORD_COLOR = "#ff9f1c";
const LINE_COLOR = "rgba(255,159,28,0.25)";
const WORDS = [
  "Databases","API","FastAPI","Python","Cloud","AWS","S3","Docker","Linux",
  "Backend","Frontend","REST","GraphQL","Auth","JWT","OAuth","CI/CD",
  "Microservices","Kubernetes","Caching","Redis","PostgreSQL","MySQL",
  "NoSQL","Indexes","Logs","Monitoring","Scaling","LoadBalancer",
  "Concurrency","Threads","Async","EventLoop","Sockets","HTTP","HTTPS",
  "Encryption","Security","Firewalls","IAM","Policies","Buckets",
  "ETL","Pipelines","DataFrames","CSV","Parquet","Analytics",
  "Observability","Tracing","Metrics","Latency","Throughput",
  "FaultTolerance","Resilience","Queues","Kafka","RabbitMQ",
  "MessageBroker","Streaming","Batch","MapReduce","HDFS","Spark",
  "MachineLearning","Models","Inference","Training","GPU","CPU",
  "Edge","CDN","DNS","VPC","Subnets","Gateways","ReverseProxy",
  "Nginx","Apache","WebSockets","Sessions","Cookies"
];

const nodes = [];
const NODE_COUNT = 100;

// Create nodes
for (let i = 0; i < NODE_COUNT; i++) {
  nodes.push({
    text: WORDS[i % WORDS.length],
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: 12 + Math.random() * 6
  });
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Lines
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 170) {
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // Words
  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;

    // bounce
    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

    ctx.fillStyle = WORD_COLOR;
    ctx.font = `${n.size}px sans-serif`;
    ctx.fillText(n.text, n.x, n.y);
  });

  requestAnimationFrame(animate);
}

animate();

// ==========================
// FILE UPLOAD
// ==========================
const input = document.getElementById("fileInput");
const status = document.getElementById("status");

input.addEventListener("change", async () => {
  const file = input.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  status.textContent = "Uploading...";

  try {
    const res = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error();

    status.textContent = "Upload successful";
  } catch {
    status.textContent = "Upload failed";
  }
});
