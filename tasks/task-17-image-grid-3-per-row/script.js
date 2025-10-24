// Массив изображений: ID, название, адрес
// Для примера укажем svg-файлы из задания 16 (папка ./assets/)
const images = [
  { id: 1,  title: 'HTML — структура',        src: 'assets/slide-1.svg' },
  { id: 2,  title: 'CSS — стили и вёрстка',   src: 'assets/slide-2.svg' },
  { id: 3,  title: 'JavaScript — логика',     src: 'assets/slide-3.svg' },
  { id: 4,  title: 'DOM — работа с узлами',   src: 'assets/slide-4.svg' },
  { id: 5,  title: 'HTTP — клиент ↔ сервер',  src: 'assets/slide-5.svg' },
  { id: 6,  title: 'Git — контроль версий',   src: 'assets/slide-6.svg' },
  // можно добавить ещё
];

const gallery = document.getElementById('gallery');
const meta    = document.getElementById('meta');

// Рендер галереи (3 в строке даёт CSS grid)
function render(list){
  gallery.innerHTML = '';

  // Сортируем по id на всякий случай
  const items = [...list].sort((a,b) => Number(a.id) - Number(b.id));

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';

    // Заголовок (над изображением — по условию)
    const h3 = document.createElement('h3');
    h3.className = 'card-title';
    h3.textContent = item.title;

    // Превью
    const box = document.createElement('div');
    box.className = 'thumb';

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = item.title || `Изображение #${item.id}`;
    // нормализуем путь относительно текущей страницы
    img.src = new URL(item.src, document.baseURI).href;

    // Обработка ошибок загрузки: показываем заглушку
    img.addEventListener('error', () => {
      box.classList.add('broken');
      box.innerHTML = `<div class="fallback">Не удалось загрузить<br><small>${item.src}</small></div>`;
    });

    box.appendChild(img);
    card.append(h3, box);
    gallery.appendChild(card);
  });

  meta.textContent = `Показано изображений: ${items.length}. Разметка — 3 в строке (адаптивно: 2/1 на узких экранах).`;
}

document.addEventListener('DOMContentLoaded', () => render(images));
