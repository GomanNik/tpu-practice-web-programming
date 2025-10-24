const form = document.getElementById('form');
const input = document.getElementById('meters');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');

// Мягкая фильтрация ввода: оставляем цифры, точку, запятую и пробелы
input.addEventListener('input', () => {
  const cleaned = input.value.replace(/[^\d.,\s]/g, '');
  if (cleaned !== input.value) input.value = cleaned;
});

// Сабмит + строгая валидация
form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  resultEl.hidden = true;

  const parsed = parseMeters(input.value);
  if (parsed.error) {
    errorEl.textContent = parsed.error;
    return;
  }

  const meters = parsed.value;                // число метров (> 0)
  const fullKm = Math.floor(meters / 1000);   // полные километры
  resultEl.textContent = `ПОЛНЫЕ КИЛОМЕТРЫ: ${fullKm} км`;
  resultEl.hidden = false;
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/**
 * Парсинг и проверка метража:
 * - допускаем форму "1234", "1234.5", "1 234,5"
 * - только положительные значения ≥ 0
 * - без экспоненты, без знаков +/- внутри
 */
function parseMeters(raw) {
  if (raw == null) return { error: 'Введите значение в метрах.' };

  // нормализуем: убираем пробелы и меняем запятую на точку
  const s = String(raw).trim().replace(/\s+/g, '').replace(',', '.');
  if (s === '') return { error: 'Поле пустое. Введите число в метрах.' };

  // цифры с необязательной дробной частью: 0 | 123 | 123.45
  const re = /^\d+(?:\.\d+)?$/; // ← без лишней (?:\d+) в начале
  if (!re.test(s)) {
    return { error: 'Разрешены только цифры и одна десятичная точка/запятая.' };
  }

  const n = Number(s);
  if (!Number.isFinite(n)) return { error: 'Некорректное число.' };
  if (n < 0) return { error: 'Значение не может быть отрицательным.' }; // теперь 0 допустим
  if (n > 1e15) return { error: 'Слишком большое значение.' };

  return { value: n };
}

