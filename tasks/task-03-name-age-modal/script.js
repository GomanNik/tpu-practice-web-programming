// Входная точка
document.getElementById('runBtn').addEventListener('click', askAndShow);

// Модалка: открыть/закрыть
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

function openModal(html) {
  modalBody.innerHTML = html;
  modal.hidden = false;
  closeBtn.focus();
}
function closeModal() {
  modal.hidden = true;
  document.getElementById('runBtn').focus();
}

// Основная логика
function askAndShow() {
  const name = askName();
  if (name === null) return; // отмена

  const age = askAge();
  if (age === null) return;

  const yearsWord = ruYears(age);

  const html = `
<div class="kv">
  <div class="k">Имя:</div><div class="v">${escapeHtml(name)}</div>
  <div class="k">Возраст:</div><div class="v">${age} ${yearsWord}</div>
</div>`.trim();

  openModal(html);
}

// Запрос имени (строка не пустая)
// Заменить эту функцию в script.js
function askName() {
  while (true) {
    const raw = prompt(
      'Введите ФИО (три слова, русские буквы, каждое с заглавной):',
      ''
    );
    if (raw === null) return null; // отмена

    // нормализуем пробелы
    const trimmed = raw.replace(/\s+/g, ' ').trim();
    const parts = trimmed.split(' ');

    if (parts.length !== 3) {
      alert('Нужно ввести ровно три слова (Фамилия Имя Отчество).');
      continue;
    }

    // нормализуем регистр: Первая заглавная, остальные строчные
    const normalized = parts.map(w =>
      (w[0] ?? '').toUpperCase() + (w.slice(1) ?? '').toLowerCase()
    );

    // проверки длины каждого слова: 2..30 символов
    if (normalized.some(w => w.length < 2 || w.length > 30)) {
      alert('Каждое слово должно быть длиной от 2 до 30 букв.');
      continue;
    }

    // только русские буквы; первая заглавная, остальные строчные
    const re = /^[А-ЯЁ][а-яё]+$/u;
    if (!normalized.every(w => re.test(w))) {
      alert('Допустимы только русские буквы. Первая — заглавная, остальные — строчные.');
      continue;
    }

    return normalized.join(' ');
  }
}


// Запрос возраста (целое 0..120)
function askAge() {
  while (true) {
    const raw = prompt('Введите ваш возраст (целое число):', '');
    if (raw === null) return null; // отмена
    const val = raw.trim();
    if (val === '') { alert('Возраст не может быть пустым.'); continue; }
    const n = Number(val);
    if (Number.isInteger(n) && n >= 0 && n <= 120) return n;
    alert('Введите целое число от 0 до 120.');
  }
}

// Склонение «год/года/лет»
function ruYears(n) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return 'лет';
  if (b === 1) return 'год';
  if (b >= 2 && b <= 4) return 'года';
  return 'лет';
}

// Защита от XSS в выводе
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (ch) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
}
