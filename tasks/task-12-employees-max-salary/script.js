// Данные сотрудников (ID, Имя, Оклад)
const employees = [
  { id: 301, name: 'Иванов Иван',        salary: 82_000 },
  { id: 302, name: 'Петрова Анна',       salary: 95_500 },
  { id: 303, name: 'Сидоров Михаил',     salary: 73_200 },
  { id: 304, name: 'Кузнецова Ольга',    salary: 95_500 }, // такой же максимум — покажем обоих
  { id: 305, name: 'Смирнов Дмитрий',    salary: 88_000 }
];

// Формат денег
const fmtMoney = new Intl.NumberFormat('ru-RU', { style:'currency', currency:'RUB', maximumFractionDigits: 2 });

const tbody = document.getElementById('employeesBody');
const maxWrap = document.getElementById('maxWrap');

// Отрисовка таблицы сотрудников
function renderEmployees(items){
  tbody.innerHTML = '';
  items.forEach((e, i) => {
    const tr = document.createElement('tr');

    const tdIdx = document.createElement('td');
    tdIdx.textContent = (i + 1).toString();

    const tdId = document.createElement('td');
    tdId.textContent = e.id.toString();

    const tdName = document.createElement('td');
    tdName.textContent = e.name;

    const tdSalary = document.createElement('td');
    tdSalary.textContent = fmtMoney.format(e.salary);
    tdSalary.className = 't-right';

    tr.append(tdIdx, tdId, tdName, tdSalary);
    tbody.appendChild(tr);
  });
}

// Поиск максимума (возвращаем массив сотрудников с max)
function findMaxEmployees(items){
  if (!items.length) return [];
  const maxSalary = items.reduce((m, e) => Math.max(m, Number(e.salary || 0)), -Infinity);
  return items.filter(e => Number(e.salary) === maxSalary);
}

// Рендер карточек с максимумом
function renderMaxCards(list){
  maxWrap.innerHTML = '';
  if (!list.length) {
    const p = document.createElement('p');
    p.className = 't-muted';
    p.textContent = 'Нет данных.';
    maxWrap.appendChild(p);
    return;
  }

  list.forEach(e => {
    const card = document.createElement('div');
    card.className = 'max-card';

    card.innerHTML = `
      <div class="k">ID</div><div class="v">${e.id}</div>
      <div class="k">Имя</div><div class="v">${e.name}</div>
      <div class="k">Оклад</div><div class="v strong">${fmtMoney.format(e.salary)}</div>
    `;

    maxWrap.appendChild(card);
  });
}

// Инициализация
renderEmployees(employees);
renderMaxCards(findMaxEmployees(employees));
