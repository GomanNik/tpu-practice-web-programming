// ===== Список изображений (относительно текущего index.html) =====
// Файлы лежат в: tasks/task-16-image-slider/assets/slide-*.svg
const images = [
  { file: 'assets/slide-1.svg', title: 'HTML — структура документа' },
  { file: 'assets/slide-2.svg', title: 'CSS — стили и вёрстка' },
  { file: 'assets/slide-3.svg', title: 'JavaScript — логика и интерактив' },
  { file: 'assets/slide-4.svg', title: 'DOM — работа с узлами' },
  { file: 'assets/slide-5.svg', title: 'HTTP — запросы и ответы' },
  { file: 'assets/slide-6.svg', title: 'Git — контроль версий' },
];

// Нормализуем пути (на случай, если страница открыта не из корня проекта)
const slides = images.map(item => ({
  src: new URL(item.file, document.baseURI).href,
  title: item.title || ''
}));

// ===== DOM =====
const imgEl     = document.getElementById('slide');
const captionEl = document.getElementById('caption');
const counterEl = document.getElementById('counter');
const prevBtn   = document.getElementById('prev');
const nextBtn   = document.getElementById('next');

let idx = 0;

// ===== Показ кадра =====
function show(index) {
  if (!slides.length) return;

  // зацикливание
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  idx = index;

  const item = slides[idx];

  // сбрасываем src, чтобы alt был виден до onload/onerror
  imgEl.alt = `Снимок ${idx + 1}`;
  imgEl.src = '';

  const probe = new Image();
  probe.onload = () => {
    imgEl.src = item.src;
    captionEl.textContent = item.title;
    counterEl.textContent = `${idx + 1} / ${slides.length}`;
  };
  probe.onerror = () => {
    // показываем сообщение в подписи; src оставляем пустым (виден alt)
    captionEl.textContent = `Не удалось загрузить: ${item.src}`;
    counterEl.textContent = `${idx + 1} / ${slides.length}`;
    console.warn('Image load failed:', item.src);
  };
  probe.src = item.src;

  // предзагрузка соседей
  preload(idx + 1);
  preload(idx - 1);
}

function preload(i) {
  if (!slides.length) return;
  if (i < 0) i = slides.length - 1;
  if (i >= slides.length) i = 0;
  const p = new Image();
  p.src = slides[i].src;
}

// ===== Управление =====
prevBtn.addEventListener('click', () => show(idx - 1));
nextBtn.addEventListener('click', () => show(idx + 1));

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  { e.preventDefault(); show(idx - 1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
});

// Свайпы (тач)
(() => {
  let startX = null, startY = null, lock = false;

  function onStart(e) {
    const t = e.touches ? e.touches[0] : e;
    startX = t.clientX; startY = t.clientY; lock = false;
  }
  function onMove(e) {
    if (startX == null || lock) return;
    const t = e.touches ? e.touches[0] : e;
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) < 30 || Math.abs(dx) < Math.abs(dy)) return; // горизонтальный жест
    lock = true;
    if (dx > 0) show(idx - 1); else show(idx + 1);
  }
  function onEnd() { startX = startY = null; lock = false; }

  const stage = imgEl.closest('.stage') || document.body;
  stage.addEventListener('touchstart', onStart, { passive: true });
  stage.addEventListener('touchmove',  onMove,  { passive: true });
  stage.addEventListener('touchend',   onEnd);
})();

// ===== Инициализация =====
document.addEventListener('DOMContentLoaded', () => show(0));
