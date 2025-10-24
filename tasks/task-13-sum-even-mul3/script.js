const listEl = document.getElementById('list');
const summaryEl = document.getElementById('summary');

/** Массив чётных чисел [2..100], кратных 3 (то есть кратных 6) */
function numbersEvenMul3(){
  const res = [];
  for (let n = 6; n <= 100; n += 6) res.push(n);
  return res;
}

function sum(arr){ return arr.reduce((a, x) => a + x, 0); }

function render(arr){
  listEl.innerHTML = '';
  arr.forEach(n => {
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = n.toString();
    listEl.appendChild(span);
  });
  summaryEl.textContent = `Всего чисел: ${arr.length}. Сумма: ${sum(arr)}.`;
}

// init
const data = numbersEvenMul3();
render(data);
