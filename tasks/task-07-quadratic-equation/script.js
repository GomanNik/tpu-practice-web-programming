const form = document.getElementById('form');
const aEl = document.getElementById('a');
const bEl = document.getElementById('b');
const cEl = document.getElementById('c');
const errA = document.getElementById('err-a');
const errB = document.getElementById('err-b');
const errC = document.getElementById('err-c');
const out = document.getElementById('out');
document.getElementById('headline');
const work = document.getElementById('work');

/* ===== Ввод: позволяем цифры, минус, точку и запятую; НЕ убираем разделитель ===== */
for (const el of [aEl, bEl, cEl]) {
  el.addEventListener('input', () => {
    let s = el.value.replace(/[^\d.,-]/g, '');  // лишние символы
    s = s.replace(/(?!^)-/g, '');               // минус только в начале
    // точку/запятую не трогаем — пусть пользователь вводит спокойно
    if (s !== el.value) el.value = s;
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();
  out.hidden = true;
  work.innerHTML = '';

  const pa = parseNumber(aEl.value);
  const pb = parseNumber(bEl.value);
  const pc = parseNumber(cEl.value);

  if (pa.error) errA.textContent = pa.error;
  if (pb.error) errB.textContent = pb.error;
  if (pc.error) errC.textContent = pc.error;
  if (pa.error || pb.error || pc.error) return;

  const a = pa.value, b = pb.value, c = pc.value;

  if (a === 0) {
    errA.textContent = 'Коэффициент a не может быть равен 0.';
    return;
  }

  const D = b*b - 4*a*c;

  // Форматирование
  const f2 = (n) => {
    const s = Number(n).toFixed(2);
    return s.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
  };

  // Рендер подстановки
  const lines = [];
  lines.push(`<div class="line">Исходное уравнение: <strong>${fmtTerm(a,'x²')} ${fmtSigned(b,'x')} ${fmtSigned(c,'')} = 0</strong></div>`);
  lines.push(`<div class="line">Подстановка коэффициентов: <span class="dim">a = ${f2(a)}, b = ${f2(b)}, c = ${f2(c)}</span></div>`);
  lines.push(`<div class="line">Дискриминант: <strong>D = b² − 4ac = (${f2(b)})² − 4·${f2(a)}·${f2(c)} = ${f2(D)}</strong></div>`);

  if (D < 0) {
    lines.push(`<div class="line warn">Так как D &lt; 0, действительных корней нет.</div>`);
  } else {
    const sqrtD = Math.sqrt(D);
    const x1 = (-b + sqrtD) / (2*a);
    const x2 = (-b - sqrtD) / (2*a);

    lines.push(`<div class="line">Корень дискриминанта: √D = √${f2(D)} = ${f2(sqrtD)}</div>`);

    const denom = 2*a;
    lines.push(`<div class="line">x₁ = (−b + √D) / (2a) = (${f2(-b)} + ${f2(sqrtD)}) / ${f2(denom)} = <strong class="ok">${f2(x1)}</strong></div>`);
    if (D === 0) {
      lines.push(`<div class="line dim">D = 0 ⇒ корень один: x₁ = x₂ = ${f2(x1)}</div>`);
    } else {
      lines.push(`<div class="line">x₂ = (−b − √D) / (2a) = (${f2(-b)} − ${f2(sqrtD)}) / ${f2(denom)} = <strong class="ok">${f2(x2)}</strong></div>`);
    }
  }

  work.innerHTML = lines.join('\n');
  out.hidden = false;
});

function clearErrors(){
  errA.textContent = ''; errB.textContent = ''; errC.textContent = '';
}

/** Парсинг десятичного числа с проверкой ведущего нуля:
 *  допускается: -10, 0, 0.5, 12.34, -3,5
 *  запрещается: 01, -01, 00.5, 1..2, 1,2,3
 */
function parseNumber(raw){
  const rawS = String(raw ?? '').trim().replace(/\s+/g, '');
  if (rawS === '') return { error: 'Введите число.' };

  // нормализуем на точку
  const s = rawS.replace(',', '.');

  // ведущие нули запрещены: либо "0", либо "0.xxx", либо "[1-9]\d*"
  const re = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/;
  if (!re.test(s)) {
    return { error: 'Неверный формат. Пример: -3.5, 0.25, 2, 10. Нельзя писать 01.' };
  }

  const n = Number(s);
  if (!Number.isFinite(n)) return { error: 'Некорректное число.' };
  if (Math.abs(n) > 1e12) return { error: 'Слишком большое по модулю значение.' };
  return { value: n };
}

/* Вспомогательное форматирование членов уравнения */
function fmtTerm(coeff, tail){
  const s = Number(coeff);
  if (s === 0) return '';
  const sign = s > 0 ? '+' : '−';
  const abs = Math.abs(s);
  const val = (abs === 1 && tail) ? '' : String(abs).replace(/\.0+$/,'');
  let piece = `${val}${tail}`.trim();
  if (!piece) piece = '0';
  return (sign === '+' ? '' : '−') + piece;
}
function fmtSigned(coeff, tail){
  const s = Number(coeff);
  if (s === 0) return `+ 0${tail}`;
  const sign = s > 0 ? '+' : '−';
  const abs = Math.abs(s);
  const val = (abs === 1 && tail) ? '' : String(abs).replace(/\.0+$/,'');
  return `${sign} ${val}${tail}`.trim();
}
