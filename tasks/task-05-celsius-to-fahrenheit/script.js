const form = document.getElementById('form');
const input = document.getElementById('celsius');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');

// Мягкая фильтрация: оставляем цифры, знак, точку/запятую и пробелы
input.addEventListener('input', () => {
  // один ведущий минус, цифры, пробелы, одна точка/запятая
  const cleaned = input.value
    .replace(/[^\d.,\s-]/g, '')           // разрешённые символы
    .replace(/(?!^)-/g, '');              // минус только в начале
  if (cleaned !== input.value) input.value = cleaned;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  resultEl.hidden = true;

  const parsed = parseNumber(input.value);
  if (parsed.error) {
    errorEl.textContent = parsed.error;
    return;
  }

  const c = parsed.value;                 // °C как число

  // ▼ Новая проверка: абсолютный ноль
  const MIN_C = -273.15;
  if (c < MIN_C - 1e-9) { // небольшой допуск на погрешности
    errorEl.textContent = `Температура не может быть ниже абсолютного нуля (${MIN_C} °C).`;
    return;
  }

  const f = c * 1.8 + 32;                 // °F = °C * 1.8 + 32

  const cStr = fmtNumber(c);
  const fStr = fmtNumber(f);

  resultEl.textContent = `${cStr} ${ruDegrees(c)} по Цельсию это ${fStr} ${ruDegrees(f)} по Фаренгейту`;
  resultEl.hidden = false;
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/**
 * Парсинг и валидация десятичного числа:
 *  - допускаются формы: -15, -15.5, -15,5, 0, 12, 12.3, 1 234,5
 *  - одна десятичная точка/запятая, минус только в начале
 */
function parseNumber(raw) {
  if (raw == null) return { error: 'Введите температуру в °C.' };

  const s = String(raw).trim().replace(/\s+/g, '').replace(',', '.');
  if (s === '') return { error: 'Поле пустое. Введите число.' };

  // ^-?\d+(\.\d+)?$ — цифры, опциональная дробь, опциональный ведущий минус
  const re = /^-?\d+(?:\.\d+)?$/;
  if (!re.test(s)) {
    return { error: 'Разрешены только цифры, один ведущий минус и одна десятичная точка/запятая.' };
  }

  const n = Number(s);
  if (!Number.isFinite(n)) return { error: 'Некорректное число.' };
  if (Math.abs(n) > 1e6) return { error: 'Слишком большое по модулю значение.' };

  return { value: n };
}

/** Формат: до двух знаков после запятой, без лишних нулей */
function fmtNumber(n) {
  const s = n.toFixed(2);
  return s.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

/** Склонение слова «градус» по правилам русского языка */
function ruDegrees(x) {
  const n = Math.abs(Math.trunc(x)); // склоняем по целой части
  const a = n % 100, b = n % 10;
  if (a > 10 && a < 20) return 'градусов';
  if (b === 1) return 'градус';
  if (b >= 2 && b <= 4) return 'градуса';
  return 'градусов';
}
