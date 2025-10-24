const form   = document.getElementById('form');
const aEl    = document.getElementById('a');
const bEl    = document.getElementById('b');
const errA   = document.getElementById('err-a');
const errB   = document.getElementById('err-b');

const out    = document.getElementById('out');
const va     = document.getElementById('va');
const vb     = document.getElementById('vb');
const vsigns = document.getElementById('vsigns');
const vop    = document.getElementById('vop');
const vcalc  = document.getElementById('vcalc');
const vans   = document.getElementById('vans');

/* ===== Фильтрация ввода: только целые, минус только в начале ===== */
for (const el of [aEl, bEl]) {
  el.addEventListener('input', () => {
    let s = el.value.replace(/[^\d-]/g, '');
    s = s.replace(/(?!^)-/g, ''); // только один минус в начале
    if (el.value !== s) el.value = s;
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errA.textContent = '';
  errB.textContent = '';
  out.hidden = true;

  const pa = parseIntStrict(aEl.value);
  const pb = parseIntStrict(bEl.value);

  if (pa.error) errA.textContent = pa.error;
  if (pb.error) errB.textContent = pb.error;
  if (pa.error || pb.error) return;

  const a = pa.value, b = pb.value;

  // Определяем ветку по знакам
  const bothPos = a > 0 && b > 0;
  const bothNeg = a < 0 && b < 0;

  let opName, calcText, result;

  if (bothPos) {
    opName = 'Разность (a − b), оба положительные';
    result = a - b;
    calcText = `${a} − ${b} = ${result}`;
  } else if (bothNeg) {
    opName = 'Произведение (a · b), оба отрицательные';
    result = a * b;
    calcText = `${a} · ${b} = ${result}`;
  } else { // разные знаки или ноль
    opName = 'Сумма (a + b), разные знаки или один из них равен 0';
    result = a + b;
    calcText = `${a} + ${b} = ${result}`;
  }

  // Заполняем карточку вывода
  va.textContent = a.toString();
  vb.textContent = b.toString();
  vsigns.textContent = `${signName(a)} и ${signName(b)}`;
  vop.textContent = opName;
  vcalc.textContent = calcText;
  vans.textContent = result.toString();

  out.hidden = false;
});

/* ===== Вспомогательные ===== */

// Строгий разбор целого: ^-?\d+$ (без пробелов и лишних символов)
function parseIntStrict(raw) {
  const s = String(raw ?? '').trim();
  if (s === '') return { error: 'Введите целое число.' };
  if (!/^-?\d+$/.test(s)) return { error: 'Разрешены только цифры и, при необходимости, ведущий минус.' };

  // запрещаем ведущие нули у непустых целых (кроме самого нуля)
  if (/^-?0\d+$/.test(s)) return { error: 'Нельзя записывать целые с ведущим нулём (например, 01).' };

  const n = Number(s);
  if (!Number.isInteger(n)) return { error: 'Введите целое число.' };
  if (Math.abs(n) > 1e12) return { error: 'Слишком большое по модулю значение.' };
  return { value: n };
}

function signName(n) {
  if (n > 0) return 'положительное';
  if (n < 0) return 'отрицательное';
  return 'ноль';
}
