const tbody   = document.getElementById('tbody');
const avgCell = document.getElementById('avgCell');

// Формат денег (₽)
const fmtMoney = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', maximumFractionDigits: 2
});

window.addEventListener('DOMContentLoaded', () => {
  // 1) Собираем цены из data-price
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const prices = rows.map(tr => Number(tr.dataset.price));

  // 2) Средняя
  const avg = prices.reduce((s, x) => s + x, 0) / prices.length;

  // 3) Красим строки
  rows.forEach((tr, i) => {
    const price = prices[i];
    tr.classList.remove('row-low', 'row-high');
    if (price > avg) tr.classList.add('row-high');
    else if (price < avg) tr.classList.add('row-low');
    // равные средней остаются без класса
  });

  // 4) Пишем среднюю в футер
  avgCell.textContent = fmtMoney.format(avg);
});
