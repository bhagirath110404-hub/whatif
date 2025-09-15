// Starfield background
const c = document.getElementById('starfield');
const ctx = c.getContext('2d');
function resize() { c.width = innerWidth; c.height = innerHeight; }
addEventListener('resize', resize); resize();
const stars = Array.from({ length: 150 }, () => ({
  x: Math.random() * c.width,
  y: Math.random() * c.height,
  z: Math.random() * 0.5 + 0.5
}));
function drawStars() {
  ctx.clearRect(0, 0, c.width, c.height);
  for (const s of stars) {
    const r = s.z * 1.2;
    ctx.fillStyle = `rgba(200,220,255,${0.4 + 0.6 * s.z})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill();
    s.x += (s.z - 0.6) * 0.2; if (s.x > c.width) s.x = 0; if (s.x < 0) s.x = c.width;
  }
  requestAnimationFrame(drawStars);
}
drawStars();

// Suggestions
const starterPrompts = [
  "What if the Roman Empire never fell?",
  "What if the Black Death never happened?",
  "What if the Library of Alexandria survived?",
  "What if Alexander lived 20 more years?",
  "What if no Cold War nuclear arms race?",
  "What if the Ming treasure fleets colonized East Africa?",
  "What if the Industrial Revolution started in the Ottoman Empire?",
  "What if printing press scaled in China first?",
  "What if no gunpowder in Europe until 1700?",
  "What if the Confederacy won the Civil War?"
];

const chips = document.getElementById('suggestions');
starterPrompts.forEach(q => {
  const b = document.createElement('button');
  b.textContent = q;
  b.addEventListener('click', () => { document.getElementById('query').value = q; run(); });
  chips.appendChild(b);
});

// Minimal local “simulation” placeholder
function scaffoldTimeline(query, plausibility) {
  const now = new Date().getFullYear();
  const steps = [now - 200, now - 150, now - 100, now - 50, now - 10];
  const bias = plausibility / 100;
  return steps.map((y, i) => ({
    title: `${y}–${y + (i === steps.length - 1 ? 10 : steps[i + 1] - y)}`,
    text: [
      `Under this divergence, institutional inertia moderates early shocks, yielding incremental shifts in trade and alliances.`,
      `Urbanization and literacy compound technological adoption; diffusion is tempered by logistics and resource bounds.`,
      `By mid‑century, secondary powers realign around supply routes, capital markets, and ideological blocs.`,
      `Late period shows stabilization with spillovers in energy, communication, and governance capacity.`,
      `Contemporary landscape reflects path‑dependence: core regions retain capability advantages; peripheries specialize.`
    ][i].replace('this divergence', query.toLowerCase())
  }));
}

function render(results) {
  const wrap = document.getElementById('results');
  wrap.innerHTML = '';
  if (!results.length) return;
  results.forEach(r => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `<h3>${r.title}</h3><p>${r.text}</p>`;
    wrap.appendChild(card);
  });
}

function run() {
  const q = document.getElementById('query').value.trim() || 'a minor divergence';
  const p = +document.getElementById('plausibility').value;
  const out = scaffoldTimeline(q, p);
  render(out);
}

document.getElementById('go').addEventListener('click', run);
document.getElementById('query').addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
