# Реализация заданий в рамках программы «ЦК: Web-программирование — ликвидация задолженности»

Этот репозиторий содержит **комплект из 20 учебных задач** по HTML/CSS/JavaScript,
выполненных в рамках программы ликвидации академической задолженности по дисциплине
«ЦК: Web-программирование». Каждая задача расположена в отдельной папке, имеет
структуру `index.html`, `style.css`, `script.js`; при необходимости используются `assets/`
и `data.json`.

---

## Структура

```

tasks/
task-01-paragraphs-formatting/
task-02-chessboard/
...
task-20-chessboard-with-pieces/
.editorconfig
.gitignore
LICENSE
README.md
package.json

```

- Задачи изолированы и запускаются независимо.
- Стили и скрипты вынесены в отдельные файлы.
- В задачах с данными/картинками используются папки `assets/` и файлы `data.json`.

---

## Как запускать

- **Быстро:** откройте нужный `index.html` двойным кликом (большинство задач так работают).
- **Через локальный сервер (рекомендуется для fetch/JSON):**
  - *WebStorm*: Open in Browser / встроенный HTTP Server.
  - *VS Code*: расширение **Live Server**.

> Примечание: в **task-19** чтение `data.json` через `fetch` может блокироваться при открытии файла напрямую; используйте локальный сервер.

---

## Ссылки на задания

1. [Задача 01 — Параграфы, выравнивание, изображение справа](tasks/task-01-paragraphs-formatting/index.html)
2. [Задача 02 — Шахматная доска 8×8 с подписями](tasks/task-02-chessboard/index.html)
3. [Задача 03 — Имя и возраст → модальное окно (валидация ФИО/возраста)](tasks/task-03-name-age-modal/index.html)
4. [Задача 04 — Метры → полные километры](tasks/task-04-distance-km/index.html)
5. [Задача 05 — °C → °F (учтён абсолютный ноль)](tasks/task-05-celsius-to-fahrenheit/index.html)
6. [Задача 06 — Стоимость звонка (скидка 20% по выходным)](tasks/task-06-phone-call-cost/index.html)
7. [Задача 07 — Квадратное уравнение (формулы, округление)](tasks/task-07-quadratic-equation/index.html)
8. [Задача 08 — Операции над двумя целыми по знакам](tasks/task-08-sign-based-operation/index.html)
9. [Задача 09 — Массив товаров: вывод + средняя цена](tasks/task-09-products-array-average/index.html)
10. [Задача 10 — Студенты: вывести с GRADE > 4 (+блок «не прошли»)](tasks/task-10-students-filter/index.html)
11. [Задача 11 — 10 случайных чисел: элементы, сумма, среднее](tasks/task-11-random-array-average/index.html)
12. [Задача 12 — Сотрудники: максимальный оклад](tasks/task-12-employees-max-salary/index.html)
13. [Задача 13 — Сумма чётных [2..100], кратных 3 (компактно)](tasks/task-13-sum-even-mul3/index.html)
14. [Задача 14 — Таблица товаров: цвет выше/ниже средней](tasks/task-14-products-table-colorize/index.html)
15. [Задача 15 — Анкета web-разработчика (валидации, маски, пароли)](tasks/task-15-developer-form/index.html)
16. [Задача 16 — Слайдер изображений (массив, зацикливание)](tasks/task-16-image-slider/index.html)
17. [Задача 17 — Галерея: 3 изображения в ряд (id, title, src)](tasks/task-17-image-grid-3-per-row/index.html)
18. [Задача 18 — Селект цветов + добавление из белого списка](tasks/task-18-color-select-with-add/index.html)
19. [Задача 19 — Таблица товаров из JSON (№, название, цена)](tasks/task-19-products-from-json/index.html)
20. [Задача 20 — Шахматная доска с фигурами (Юникод, DOM)](tasks/task-20-chessboard-with-pieces/index.html)

---

## Лицензия

См. файл [LICENSE](LICENSE).

