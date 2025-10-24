/* ======= Задача 20: Расстановка шахматных фигур (DOM + массивы) ======= */

// Элемент доски (внутренний квадрат 8×8)
const boardEl = document.querySelector('.board');

// Файлы/колонки для построения нотации клеток
const FILES = ['a','b','c','d','e','f','g','h'];

/* Стартовая позиция: 8 строк сверху вниз (8 → 1),
   в каждой строке 8 символов:
   r n b q k b n r | p (пешка) | . (пусто)
   Прописные — белые (нижние две горизонтали), строчные — чёрные. */
const START = [
  'rnbqkbnr', // 8-я (сверху)
  'pppppppp', // 7-я
  '........', // 6-я
  '........', // 5-я
  '........', // 4-я
  '........', // 3-я
  'PPPPPPPP', // 2-я
  'RNBQKBNR'  // 1-я (снизу)
];

/* Маппинг кода фигуры → Юникод-символ */
const SYMBOL = {
  'K':'\u2654','Q':'\u2655','R':'\u2656','B':'\u2657','N':'\u2658','P':'\u2659', // белые
  'k':'\u265A','q':'\u265B','r':'\u265C','b':'\u265D','n':'\u265E','p':'\u265F'  // чёрные
};

/* Читаемые имена для aria-label */
function pieceName(code){
  const map = {
    'K':'белый король','Q':'белый ферзь','R':'белая ладья','B':'белый слон','N':'белый конь','P':'белая пешка',
    'k':'чёрный король','q':'чёрный ферзь','r':'чёрная ладья','b':'чёрный слон','n':'чёрный конь','p':'чёрная пешка'
  };
  return map[code] || 'фигура';
}

/* Основной рендер позиций */
function render(position){
  // гарантируем сетку 8×8
  boardEl.style.gridTemplateColumns = 'repeat(8, 1fr)';
  boardEl.style.gridTemplateRows = 'repeat(8, 1fr)';

  // очищаем и создаём 64 ячейки
  boardEl.innerHTML = '';
  for (let r = 0; r < 8; r++){
    for (let c = 0; c < 8; c++){
      const cell = document.createElement('div');
      cell.className = 'cell';

      // алгебраическая нотация клетки: a8 слева сверху → h1 справа снизу
      const square = FILES[c] + (8 - r);
      cell.dataset.square = square;

      const code = position[r][c];
      if (code && code !== '.'){
        const piece = document.createElement('span');
        piece.className = 'piece ' + (code === code.toUpperCase() ? 'white' : 'black');
        piece.textContent = SYMBOL[code] || '';
        piece.setAttribute('role', 'img');
        piece.setAttribute('aria-label', `${pieceName(code)} ${square}`);
        cell.appendChild(piece);
      }

      boardEl.appendChild(cell);
    }
  }
}

/* ==== Инициализация ==== */
document.addEventListener('DOMContentLoaded', () => {
  render(START);
});

/* === Дополнительно (по желанию): API в консоли ===
   - window.renderFEN(fen) — быстро выставить позицию из FEN (только фигуры)
   - window.clearBoard()   — очистить доску
*/
(function exposeHelpers(){
  function fromFEN(fen){
    const [pieces] = String(fen).trim().split(/\s+/);
    const rows = pieces.split('/');
    if (rows.length !== 8) throw new Error('Некорректный FEN');
    return rows.map(row => {
      let out = '';
      for (const ch of row){
        if (/[1-8]/.test(ch)) out += '.'.repeat(Number(ch));
        else out += ch;
      }
      if (out.length !== 8) throw new Error('Некорректный ряд FEN');
      return out;
    });
  }
  window.renderFEN = (fen) => render(fromFEN(fen));
  window.clearBoard = () => render(Array(8).fill('........'));
})();
