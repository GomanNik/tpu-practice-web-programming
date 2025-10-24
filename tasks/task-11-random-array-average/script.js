const bodyEl  = document.getElementById('body');
const countEl = document.getElementById('count');
const sumEl   = document.getElementById('sum');
const avgEl   = document.getElementById('avg');
const regen   = document.getElementById('regen');

/** Случайное целое в диапазоне [min, max] */
function randInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Генерация массива из 10 чисел */
function makeArray(){
  const arr = [];
  for (let i = 0; i < 10; i++){
    arr.push(randInt(1, 100));
  }
  return arr;
}

/** Сумма */
function sum(arr){ return arr.reduce((acc, n) => acc + n, 0); }
/** Среднее (2 знака) */
function avg(arr){
  if (!arr.length) return 0;
  const a = sum(arr) / arr.length;
  return Number(a.toFixed(2));
}

/** Рендер таблицы и футера */
function render(arr){
  bodyEl.innerHTML = '';
  arr.forEach((val, i) => {
    const tr = document.createElement('tr');

    const tdIdx = document.createElement('td');
    tdIdx.textContent = (i + 1).toString();

    const tdVal = document.createElement('td');
    tdVal.textContent = val.toString();
    tdVal.className = 't-right';

    tr.append(tdIdx, tdVal);
    bodyEl.appendChild(tr);
  });

  countEl.textContent = arr.length.toString();
  sumEl.textContent   = sum(arr).toString();
  avgEl.textContent   = avg(arr).toString();
}

/** Инициализация */
let data = makeArray();
render(data);

regen.addEventListener('click', () => {
  data = makeArray();
  render(data);
});
