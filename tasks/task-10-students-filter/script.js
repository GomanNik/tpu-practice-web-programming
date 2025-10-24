// Массив студентов: ID, FIO, GRADE (средний балл)
const students = [
  { id: 201, fio: 'Иванов Иван Иванович',      grade: 4.2 },
  { id: 202, fio: 'Петрова Анна Сергеевна',     grade: 4.9 },
  { id: 203, fio: 'Сидоров Михаил Петрович',    grade: 3.8 },
  { id: 204, fio: 'Кузнецова Ольга Викторовна', grade: 4.5 },
  { id: 205, fio: 'Смирнов Дмитрий Алексеевич', grade: 4.0 }
];

// Разделяем на показанных и не показанных
const shown = students.filter(s => Number(s.grade) > 4);
const excluded = students.filter(s => Number(s.grade) <= 4);

const bodyShown = document.getElementById('studentsBody');
const noteShown = document.getElementById('footerNote');

const bodyExcl = document.getElementById('excludedBody');
const noteExcl = document.getElementById('excludedNote');

// Рендер таблицы
function renderTable(items, tbody) {
  tbody.innerHTML = '';

  if (!items.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.textContent = 'Нет записей.';
    td.className = 't-muted';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  items.forEach((s, i) => {
    const tr = document.createElement('tr');

    const tdIdx = document.createElement('td');
    tdIdx.textContent = (i + 1).toString();

    const tdId = document.createElement('td');
    tdId.textContent = s.id.toString();

    const tdFio = document.createElement('td');
    tdFio.textContent = s.fio;

    const tdGrade = document.createElement('td');
    tdGrade.textContent = formatGrade(s.grade);
    tdGrade.className = 't-right';

    tr.append(tdIdx, tdId, tdFio, tdGrade);
    tbody.appendChild(tr);
  });
}

// Формат среднего балла: до 2 знаков, без лишних нулей
function formatGrade(x) {
  const s = Number(x).toFixed(2);
  return s.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

// Инициализация
renderTable(shown, bodyShown);
renderTable(excluded, bodyExcl);

noteShown.textContent = `Показано студентов: ${shown.length} из ${students.length} (условие: GRADE > 4).`;
noteExcl.textContent  = `Не выведено: ${excluded.length} (условие: GRADE ≤ 4).`;
