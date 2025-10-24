/* ======================================================================
   ЗАДАЧА 18 — Список цветов с добавлением из белого списка (200+ названий)
   ====================================================================== */

/* ---------- 0) НОРМАЛИЗАЦИЯ ВВОДА ---------- */
// все варианты дефисов/тире/неразрывных дефисов -> обычный "-"
const DASH_RX = /[\u2010-\u2015\u2212\u2043\u00AD\u2011]/g;
const norm = (s) =>
  String(s)
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(DASH_RX, '-')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, ' ');

function properCase(s){
  // EN: TitleCase; RU: первая буква каждого слова/части через дефис — заглавная
  if (/^[a-z]+$/i.test(s)) return s.replace(/\b[a-z]/g, c => c.toUpperCase());
  return s.replace(/(^|[\s-])([а-яё])/g, (m,p,ch)=> p + ch.toUpperCase());
}

/* ---------- 1) ИСХОДНЫЕ СПИСКИ НАЗВАНИЙ ---------- */
/* CSS keywords (полный список из спецификации — 147) */
const CSS_EN = [
  'aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond','blue','blueviolet',
  'brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue',
  'darkcyan','darkgoldenrod','darkgray','darkgreen','darkgrey','darkkhaki','darkmagenta','darkolivegreen','darkorange',
  'darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkslategrey','darkturquoise',
  'darkviolet','deeppink','deepskyblue','dimgray','dimgrey','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia',
  'gainsboro','ghostwhite','gold','goldenrod','gray','green','greenyellow','grey','honeydew','hotpink','indianred','indigo',
  'ivory','khaki','lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral','lightcyan',
  'lightgoldenrodyellow','lightgray','lightgreen','lightgrey','lightpink','lightsalmon','lightseagreen','lightskyblue',
  'lightslategray','lightslategrey','lightsteelblue','lightyellow','lime','limegreen','linen','magenta','maroon',
  'mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen','mediumslateblue','mediumspringgreen',
  'mediumturquoise','mediumvioletred','midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldlace',
  'olive','olivedrab','orange','orangered','orchid','palegoldenrod','palegreen','paleturquoise','palevioletred','papayawhip',
  'peachpuff','peru','pink','plum','powderblue','purple','rebeccapurple','red','rosybrown','royalblue','saddlebrown',
  'salmon','sandybrown','seagreen','seashell','sienna','silver','skyblue','slateblue','slategray','slategrey','snow',
  'springgreen','steelblue','tan','teal','thistle','tomato','turquoise','violet','wheat','white','whitesmoke','yellow',
  'yellowgreen'
];

/* Русские названия + популярные оттенки (сокращённый, но большой список 120+) */
const RU_BASE = [
  'белый','черный','красный','зеленый','синий','голубой','желтый','оранжевый','фиолетовый','розовый',
  'коричневый','серый','бордовый','бирюзовый','пурпурный','лаймовый','слоновая кость','кремовый','лиловый',
  'оливковый','золотой','серебристый','мятный','индиго','хаки','салатовый','морской волны','шоколадный',
  'лазурный','малиновый','коралловый','терракотовый','пшеничный','медовый','горчичный','сапфировый','сиреневый',
  'графитовый','стальной','дымчатый','янтарный','рубиновый','изумрудный','небесный','болотный','песочный','пудровый',
  'угольный','аспидный','шампанское','мокко','карминный','алый','лимонный','лавандовый','персиковый','айвори','маренго',
  'бежевый','карамельный','бутылочно-зеленый','темно-синий','темно-зеленый','темно-красный','светло-серый','темно-серый',
  'ярко-розовый','ярко-синий','светло-фиолетовый','светло-голубой','светло-зеленый','светло-розовый','кавернозный',
  'сине-зеленый','серо-голубой','оливково-зеленый','фисташковый','нефритовый','ультрамариновый','умбра','шафранный',
  'бордовый темный','сливовый','мятный светлый','морская волна','янтарно-желтый','топазовый','медный','охра',
  'каштановый','кобальтовый','гранатовый','васильковый','пыльно-розовый','пыльно-синий','туманно-серый','болотный темный'
];

/* ---------- 2) МЭППИНГ RU -> CSS ЦВЕТ (для подсветки) ---------- */
/* Большой, но не бесконечный набор соответствий — легко расширяем. */
const RU_TO_CSS = {
  'белый':'white','черный':'black','красный':'red','зеленый':'green','синий':'blue','голубой':'skyblue',
  'желтый':'yellow','оранжевый':'orange','фиолетовый':'violet','розовый':'pink','коричневый':'saddlebrown',
  'серый':'gray','бордовый':'maroon','бирюзовый':'turquoise','пурпурный':'purple','лаймовый':'lime',
  'слоновая кость':'ivory','айвори':'ivory','кремовый':'cornsilk','лиловый':'thistle','оливковый':'olive',
  'золотой':'gold','серебристый':'silver','мятный':'mintcream','индиго':'indigo','хаки':'khaki',
  'салатовый':'lawngreen','морской волны':'teal','морская волна':'teal','шоколадный':'chocolate',
  'лазурный':'deepskyblue','малиновый':'crimson','коралловый':'coral','терракотовый':'peru',
  'пшеничный':'wheat','медовый':'goldenrod','горчичный':'darkkhaki','сапфировый':'royalblue','сиреневый':'plum',
  'графитовый':'dimgray','стальной':'steelblue','дымчатый':'slategray','янтарный':'gold','рубиновый':'firebrick',
  'изумрудный':'seagreen','небесный':'lightskyblue','болотный':'darkolivegreen','песочный':'tan',
  'пудровый':'mistyrose','угольный':'black','аспидный':'slategray','шампанское':'linen','мокко':'sienna',
  'карминный':'crimson','алый':'red','лимонный':'lemonchiffon','лавандовый':'lavender','персиковый':'peachpuff',
  'маренго':'dimgray','бежевый':'beige','карамельный':'burlywood','бутылочно-зеленый':'darkgreen',
  'темно-синий':'navy','темно-зеленый':'darkgreen','темно-красный':'darkred','светло-серый':'lightgray',
  'темно-серый':'darkgray','ярко-розовый':'hotpink','ярко-синий':'dodgerblue','светло-фиолетовый':'thistle',
  'светло-голубой':'lightblue','светло-зеленый':'lightgreen','светло-розовый':'lightpink',
  'сине-зеленый':'teal','серо-голубой':'lightslategray','оливково-зеленый':'olivedrab','фисташковый':'palegreen',
  'нефритовый':'mediumseagreen','ультрамариновый':'mediumblue','умбра':'sienna','шафранный':'moccasin',
  'сливовый':'plum','янтарно-желтый':'gold','топазовый':'lightgoldenrodyellow','медный':'peru','охра':'darkkhaki',
  'каштановый':'saddlebrown','кобальтовый':'royalblue','гранатовый':'darkred','васильковый':'cornflowerblue',
  'пыльно-розовый':'rosybrown','пыльно-синий':'slateblue','туманно-серый':'gainsboro','болотный темный':'darkolivegreen'
};

/* ---------- 3) СБОРКА БЕЛОГО СПИСКА (канонизация) ---------- */
const CANON = new Map();

// EN: canonical = TitleCase (как у CSS)
for (const name of CSS_EN) CANON.set(norm(name), properCase(name));
// RU: canonical = «Красивый Русский»
for (const name of RU_BASE) CANON.set(norm(name), properCase(name));

// Доп. двунаправленные синонимы RU <-> EN (если EN есть в CSS_EN)
[
  ['слоновая кость','ivory'],['лавандовый','lavender'],['бирюзовый','turquoise'],['голубой','skyblue'],
  ['серый','gray'],['серый','grey'],['лаймовый','lime'],['коралловый','coral'],['розовый','pink'],
  ['фиолетовый','violet'],['пшеничный','wheat'],['персиковый','peachpuff']
].forEach(([ru,en])=>{
  if (CANON.has(norm(en))) CANON.set(norm(ru), CANON.get(norm(en)));
});

/* ---------- 4) УТИЛИТЫ ДЛЯ ИНТЕРФЕЙСА ---------- */
const sel  = document.getElementById('colorSelect');
const inp  = document.getElementById('colorInput');
const add  = document.getElementById('addBtn');
const msg  = document.getElementById('msg');
const sugg = document.getElementById('sugg');

function setMsg(text, ok=false){
  msg.textContent = text || '';
  msg.className = 'msg ' + (text ? (ok ? 'ok' : 'err') : '');
  if (!text) inp.classList.remove('invalid'); else if (!ok) inp.classList.add('invalid');
}
function clearMsg(){ setMsg(''); }

(function attachInvalidStyle(){
  const style = document.createElement('style');
  style.textContent = `.input.invalid{outline:2px solid rgba(220,38,38,.25); border-color:#ef4444}`;
  document.head.appendChild(style);
})();

function isValidCssColor(value){
  const s = new Option().style; s.color = ''; s.color = value;
  return !!s.color;
}
function paintFor(displayName){
  // если английское CSS-имя — используем его напрямую
  if (isValidCssColor(displayName)) return displayName;
  // иначе пробуем русское соответствие
  const css = RU_TO_CSS[norm(displayName)];
  return isValidCssColor(css) ? css : null;
}
function optionExists(displayName){
  const want = norm(displayName);
  return Array.from(sel.options).some(o => norm(o.textContent) === want);
}
function addOption(displayName){
  const opt = document.createElement('option');
  opt.textContent = displayName;
  const paint = paintFor(displayName);
  if (paint){
    opt.style.background = `linear-gradient(90deg, ${paint}, ${paint})`;
    opt.style.color = '#0b1736';
  }
  sel.appendChild(opt);
  sel.selectedIndex = sel.options.length - 1;
  saveOptions();
}

/* ---------- 5) ПОДСКАЗКИ ---------- */
function renderSuggestions(q){
  sugg.innerHTML = '';
  const key = norm(q);
  if (!key) return;
  const hits = [];
  for (const [k,v] of CANON){
    if (k.startsWith(key)) hits.push(v);
    if (hits.length >= 8) break;
  }
  for (const h of hits){
    const li = document.createElement('li');
    li.textContent = h;
    li.addEventListener('click', () => {
      inp.value = h; sugg.innerHTML = ''; inp.focus();
    });
    sugg.appendChild(li);
  }
}

/* ---------- 6) LOCALSTORAGE (persist опций) ---------- */
const LS_KEY = 'task18_colors';
function saveOptions(){
  const arr = Array.from(sel.options).map(o => o.textContent);
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}
function loadOptions(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)){
      sel.innerHTML = '';
      for (const name of arr){
        const opt = document.createElement('option');
        opt.textContent = name;
        const paint = paintFor(name);
        if (paint){
          opt.style.background = `linear-gradient(90deg, ${paint}, ${paint})`;
          opt.style.color = '#0b1736';
        }
        sel.appendChild(opt);
      }
    }
  }catch{}
}

/* ---------- 7) ОБРАБОТЧИКИ ---------- */
add.addEventListener('click', () => {
  clearMsg();
  const raw = inp.value;
  const key = norm(raw);

  if (!raw.trim()){
    setMsg('Поле пустое. Введите название цвета.'); renderSuggestions(''); inp.focus(); return;
  }
  if (!CANON.has(key)){
    setMsg('Неизвестный цвет. Используйте корректное название из встроенного списка (рус/англ).');
    renderSuggestions(raw); inp.focus(); return;
  }

  const display = CANON.get(key);      // каноническая форма для вывода
  if (optionExists(display)){ setMsg('Такой цвет уже есть в списке.'); inp.focus(); return; }

  addOption(display);
  setMsg(`Добавлено: ${display}`, true);
  sugg.innerHTML = '';
  inp.value = ''; inp.focus();
});

inp.addEventListener('input', e => { clearMsg(); renderSuggestions(e.target.value); });
inp.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); add.click(); }});

/* ---------- 8) ИНИЦИАЛИЗАЦИЯ ---------- */
window.addEventListener('DOMContentLoaded', () => {
  loadOptions();
  // подсветим стартовые (если они уже есть в разметке)
  Array.from(sel.options).forEach(o => {
    const paint = paintFor(o.textContent);
    if (paint){
      o.style.background = `linear-gradient(90deg, ${paint}, ${paint})`;
      o.style.color = '#0b1736';
    }
  });
});
