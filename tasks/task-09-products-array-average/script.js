// Массив товаров: ID, Title, Price (в рублях)
const products = [
  { id: 101, title: 'Кофеварка капельная', price: 2590.00 },
  { id: 102, title: 'Электрочайник',       price: 1890.50 },
  { id: 103, title: 'Тостер компактный',   price: 1490.00 },
  { id: 104, title: 'Блендер ручной',      price: 2199.99 },
  { id: 105, title: 'Весы кухонные',       price: 990.00 }
];

// Формат денежных значений в рублях
const fmtMoney = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', maximumFractionDigits: 2
});

const body = document.getElementById('productsBody');
const avgCell = document.getElementById('avgCell');

// рендер таблицы
function renderTable(items) {
  body.innerHTML = '';
  items.forEach((p, i) => {
    const tr = document.createElement('tr');

    const tdIdx = document.createElement('td');
    tdIdx.textContent = (i + 1).toString();

    const tdId = document.createElement('td');
    tdId.textContent = p.id.toString();

    const tdTitle = document.createElement('td');
    tdTitle.textContent = p.title;

    const tdPrice = document.createElement('td');
    tdPrice.textContent = fmtMoney.format(p.price);
    tdPrice.className = 't-right';

    tr.append(tdIdx, tdId, tdTitle, tdPrice);
    body.appendChild(tr);
  });
}

// средняя стоимость
function calcAverage(items) {
  if (!items.length) return 0;
  const sum = items.reduce((acc, p) => acc + Number(p.price || 0), 0);
  return sum / items.length;
}

// Инициализация
renderTable(products);
avgCell.textContent = fmtMoney.format(calcAverage(products));
