// ====== DOM ======
const form = document.getElementById('devForm');
const submitBtn = document.getElementById('submitBtn');

// Карта полей (id -> элемент)
const F = {
  login : form.querySelector('#login'),
  pass  : form.querySelector('#pass'),
  pass2 : form.querySelector('#pass2'),
  spec  : form.querySelector('#spec'),
  sex   : form.querySelector('input[name="sex"]'), // для фокуса возьмём первый
  about : form.querySelector('#about'),
};

// Хелперы для вывода ошибок под полями (без правок CSS)
function clearErrors() {
  form.querySelectorAll('.js-error').forEach(n => n.remove());
  form.querySelectorAll('.invalid').forEach(n => n.classList.remove('invalid'));
}
function showError(inputEl, msg) {
  // поле .field — ближайшая правая ячейка
  const fieldCell = inputEl.closest('.field') || inputEl.parentElement;
  const err = document.createElement('div');
  err.className = 'js-error';
  err.style.cssText = 'margin-top:4px;color:#b91c1c;font-size:13px';
  err.textContent = msg;
  fieldCell.appendChild(err);
  // визуально подсветим само поле
  inputEl.classList.add('invalid');
  inputEl.style.outline = '2px solid rgba(220,38,38,.25)';
  inputEl.style.borderColor = '#ef4444';
}
function clearOutline(el){
  el.style.outline = '';
  el.style.borderColor = '';
}

// ====== Валидации ======

// логин: 3..20 символов, буква в начале (латиница/кириллица), далее буквы/цифры/_/-
function validateLogin(v) {
  const s = v.trim();
  if (s.length === 0) return 'Укажите регистрационное имя.';
  if (s.length < 3 || s.length > 20) return 'Длина логина: 3–20 символов.';
  // первая — буква, дальше буквы/цифры/_/-
  const re = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9_-]{2,19}$/u;
  if (!re.test(s)) return 'Логин должен начинаться с буквы и содержать только буквы, цифры, «_» или «-».';
  // не весь из цифр — уже исключили началом с буквы
  return null;
}

// пароль: 8–64, строчная+прописная+цифра+спец, без пробелов, не содержит логин
function validatePassword(pass, login) {
  const s = pass;
  if (s.length === 0) return 'Введите пароль.';
  if (s.length < 8 || s.length > 64) return 'Длина пароля: 8–64 символа.';
  if (/\s/.test(s)) return 'Пароль не должен содержать пробелы.';
  if (!/[a-zа-яё]/i.test(s)) return 'Пароль должен содержать буквы.';
  if (!/[a-zа-яё]/.test(s)) return 'Добавьте хотя бы одну строчную букву.';
  if (!/[A-ZА-ЯЁ]/.test(s)) return 'Добавьте хотя бы одну прописную букву.';
  if (!/\d/.test(s)) return 'Добавьте хотя бы одну цифру.';
  if (!/[^\p{L}\p{N}]/u.test(s)) return 'Добавьте хотя бы один спецсимвол (например, !@#$%).';
  if (login && s.toLowerCase().includes(login.trim().toLowerCase()))
    return 'Пароль не должен содержать логин.';
  return null;
}

// подтверждение пароля
function validatePasswordRepeat(pass, pass2) {
  if (pass2.length === 0) return 'Подтвердите пароль.';
  if (pass !== pass2) return 'Пароли не совпадают.';
  return null;
}

// специализация — обязательна (есть значения по умолчанию)
function validateSpec(v) {
  if (!v || v.trim() === '') return 'Выберите специализацию.';
  return null;
}

// пол — обязательный (radio)
function validateSex() {
  const checked = form.querySelector('input[name="sex"]:checked');
  if (!checked) return 'Укажите пол.';
  return null;
}

// о себе — необязательно, но ограничим 0..500 символов
function validateAbout(v) {
  const s = v.trim();
  if (s.length > 500) return 'Поле «О себе» не должно превышать 500 символов.';
  return null;
}

// сила пароля — чисто информационно в title
function passwordStrength(pass) {
  let score = 0;
  if (pass.length >= 8) score++;
  if (pass.length >= 12) score++;
  if (/[a-z]/.test(pass)) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/\d/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return Math.min(score, 5); // 0..5
}
function strengthLabel(n){
  return ['очень слабый','слабый','средний','хороший','сильный','очень сильный'][n];
}

// ====== Реакция на ввод: снимаем подсветку и подсказка силы пароля ======
['input','change'].forEach(ev => {
  form.addEventListener(ev, (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    if (e.target.classList && e.target.classList.contains('invalid')) {
      clearOutline(e.target);
      e.target.classList.remove('invalid');
      const cell = e.target.closest('.field');
      cell && cell.querySelectorAll('.js-error').forEach(n => n.remove());
    }
    if (e.target.id === 'pass') {
      const s = passwordStrength(F.pass.value);
      F.pass.title = `Сила пароля: ${strengthLabel(s)} (${s}/5)`;
    }
  });
});

// ====== Отправка ======
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  clearErrors();

  // собираем значения
  const data = new FormData(form);
  const login = (data.get('login') || '').toString();
  const pass  = (data.get('pass')  || '').toString();
  const pass2 = (data.get('pass2') || '').toString();
  const spec  = (data.get('spec')  || '').toString();
  const sexEl = form.querySelector('input[name="sex"]:checked');
  const sex   = sexEl ? sexEl.value : '';
  const skills = data.getAll('skills').map(String);
  const about  = (data.get('about') || '').toString();

  // валидации
  const errors = [];

  const eLogin = validateLogin(login);
  if (eLogin) { errors.push(['login', eLogin]); showError(F.login, eLogin); }

  const ePass = validatePassword(pass, login);
  if (ePass) { errors.push(['pass', ePass]); showError(F.pass, ePass); }

  const ePass2 = validatePasswordRepeat(pass, pass2);
  if (ePass2) { errors.push(['pass2', ePass2]); showError(F.pass2, ePass2); }

  const eSpec = validateSpec(spec);
  if (eSpec) { errors.push(['spec', eSpec]); showError(F.spec, eSpec); }

  const eSex = validateSex();
  if (eSex) { errors.push(['sex', eSex]); showError(F.sex, eSex); }

  const eAbout = validateAbout(about);
  if (eAbout) { errors.push(['about', eAbout]); showError(F.about, eAbout); }

  // если есть ошибки — фокус на первое проблемное поле и выходим
  if (errors.length) {
    const firstFieldId = errors[0][0];
    const firstEl = F[firstFieldId] || form.querySelector(`[name="${firstFieldId}"]`);
    firstEl && firstEl.focus();
    return;
  }

  // всё ок — формируем аккуратный вывод
  const msg = [
    `Регистрационное имя: ${login}`,
    `Специализация: ${spec}`,
    `Пол: ${sex || '—'}`,
    `Навыки: ${skills.length ? skills.join(', ') : '—'}`,
    `О себе: ${about.trim() || '—'}`
  ].join('\n');

  alert(msg);
});

// Enter на форме — как клик по "зарегистрировать"
form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitBtn.click();
});

// Сброс формы — очищаем подсветку и подсказки
form.addEventListener('reset', () => {
  setTimeout(() => {
    clearErrors();
    Object.values(F).forEach(clearOutline);
    F.pass.title = '';
  }, 0);
});
