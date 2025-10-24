// Формат вывода цен
const fmtMoney = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', maximumFractionDigits: 2
});

const tbody  = document.getElementById('tbody');
const status = document.getElementById('status');

// Рендер строки
function rowTemplate(i, item){
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${i}</td>
    <td>${escapeHtml(item.title)}</td>
    <td class="t-right">${fmtMoney.format(item.price)}</td>
  `;
  return tr;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

// Загрузка JSON и вывод
async function load(){
  try{
    status.textContent = 'Загрузка…';
    const res = await fetch('./data.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0){
      throw new Error('Пустой или некорректный JSON.');
    }

    tbody.innerHTML = '';
    data.slice(0, 15).forEach((item, idx) => {
      // простая валидация полей
      const title = item?.title ?? 'Без названия';
      const price = Number(item?.price);
      const safeItem = { title, price: Number.isFinite(price) ? price : 0 };
      tbody.appendChild(rowTemplate(idx + 1, safeItem));
    });

    status.textContent = `Загружено позиций: ${Math.min(15, data.length)}.`;
    status.classList.remove('err');
  }catch(err){
    status.textContent = `Ошибка загрузки данных: ${err.message}. Убедитесь, что файл data.json лежит рядом со страницей и страница запущена через локальный сервер (не file://).`;
    status.classList.add('err');
  }
}

document.addEventListener('DOMContentLoaded', load);
