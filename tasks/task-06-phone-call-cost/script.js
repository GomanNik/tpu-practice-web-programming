const form = document.getElementById('form');
const minutesEl = document.getElementById('minutes');
const rateEl = document.getElementById('rate');
const errMin = document.getElementById('err-min');
const errRate = document.getElementById('err-rate');
const resultEl = document.getElementById('result');
const noteEl = document.getElementById('note');

/* ===== Ограничение ввода: позволяем , или . и максимум 2 знака после ===== */
for (const el of [minutesEl, rateEl]) {
  el.addEventListener('input', () => {
    // 1) оставляем только цифры и разделители
    let raw = el.value.replace(/[^\d.,]/g, '');

    // 2) оставляем только первый встретившийся разделитель (.,)
    // и запоминаем его символ, чтобы не навязывать точку или запятую
    const firstSepIdx = raw.search(/[.,]/);
    let sep = firstSepIdx >= 0 ? raw[firstSepIdx] : null;

    if (sep !== null) {
      // убираем все остальные разделители
      const head = raw.slice(0, firstSepIdx).replace(/[.,]/g, '');
      const tail = raw.slice(firstSepIdx + 1).replace(/[.,]/g, '');
      // 3) ограничиваем дробную часть двумя цифрами
      const frac = tail.replace(/\D/g, '').slice(0, 2);
      const intg = head.replace(/\D/g, '');
      raw = `${intg}${sep}${frac}`;
    } else {
      // только целая часть
      raw = raw.replace(/[.,]/g, '').replace(/\D/g, '');
    }

    if (raw === ',' || raw === '.') raw = '';

    if (el.value !== raw) el.value = raw;
  });
}


form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();
  hideOutput();

  const minutes = parseNonNegativeNumber(minutesEl.value);
  const rate = parseNonNegativeNumber(rateEl.value);

  if (minutes.error) { errMin.textContent = minutes.error; }
  if (rate.error) { errRate.textContent = rate.error; }
  if (minutes.error || rate.error) return;

  const day = new Date().getDay();          // 0 = вс, 6 = сб
  const isWeekend = (day === 0 || day === 6);
  const discount = isWeekend ? 0.20 : 0.0;

  const base = minutes.value * rate.value;
  const total = base * (1 - discount);

  const minutesStr = fmtNumber(minutes.value);
  const totalStr = fmtMoney(total);

  resultEl.textContent = `Разговор продлился ${minutesStr} ${ruMinutes(minutes.value)}, стоимость разговора: ${totalStr}`;
  resultEl.hidden = false;

  noteEl.textContent = isWeekend
    ? 'Применена уикенд-скидка 20% (суббота/воскресенье).'
    : 'Скидка не применяется (будний день).';
  noteEl.hidden = false;

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function clearErrors() {
  errMin.textContent = '';
  errRate.textContent = '';
}
function hideOutput() {
  resultEl.hidden = true;
  noteEl.hidden = true;
}

/** Парсинг неотрицательного числа с максимум двумя знаками после запятой */
function parseNonNegativeNumber(raw) {
  if (raw == null) return { error: 'Введите число.' };

  // нормализуем: убираем пробелы и меняем запятую на точку
  const s = String(raw).trim().replace(/\s+/g, '').replace(',', '.');
  if (s === '') return { error: 'Поле пустое. Введите число.' };

  // Разрешаем: 0 | 12 | 12.3 | 12.34  (не более 2 знаков в дробной части)
  const re = /^\d+(?:\.\d{1,2})?$/;
  if (!re.test(s)) {
    return { error: 'Допустимы только числа ≥ 0 с не более чем двумя знаками после запятой.' };
  }

  const n = Number(s);
  if (!Number.isFinite(n)) return { error: 'Некорректное число.' };
  if (n < 0) return { error: 'Значение не может быть отрицательным.' };
  if (n > 1e12) return { error: 'Слишком большое значение.' };
  return { value: n };
}

/** Формат обычного числа (до 2 знаков, без лишних нулей) */
function fmtNumber(n) {
  const s = n.toFixed(2);
  return s.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

/** Формат денег в ₽, 2 знака после запятой */
function fmtMoney(n) {
  return `${n.toFixed(2)} ₽`;
}

/** Склонение «минута/минуты/минут» по целой части */
function ruMinutes(x) {
  const n = Math.abs(Math.trunc(x));
  const a = n % 100, b = n % 10;
  if (a > 10 && a < 20) return 'минут';
  if (b === 1) return 'минута';
  if (b >= 2 && b <= 4) return 'минуты';
  return 'минут';
}
