"use strict";

/**
 * Карта корпуса: рисует этаж по данным из window.FLOORS[n]
 * (см. floors/floor_N_data.js), строит маршрут по графу и показывает его
 * по шагам. Никакого fetch — все данные уже подключены обычными <script>.
 *
 * ОГЛАВЛЕНИЕ
 *   1. Настройки и константы
 *   2. Состояние
 *   3. Мелкие утилиты
 *   4. Подписи на карте (подбор шрифта, переносы)
 *   5. Геометрия фигур (скосы, рамки, вырезы, скругления)
 *   6. Граф и маршрутизация (граф этажа, Дейкстра, граф всех этажей)
 *   7. Построение маршрута и текст подсказок
 *   8. Отрисовка этажа
 *   9. Попап кабинета
 *  10. Выбор старта/финиша
 *  11. Панель маршрута (шаги, кнопка «Завершить»)
 *  12. Поля ввода «Откуда/Куда»
 *  13. Обработчики событий и запуск
 */


/* ===================================================================
 * 1. НАСТРОЙКИ И КОНСТАНТЫ
 * =================================================================== */

const svgNS = "http://www.w3.org/2000/svg";

// Размер системы координат карты — одинаков для всех этажей.
const VIEWBOX_W = 1310;
const VIEWBOX_H = 700;

// Элементы страницы (скрипт подключён в конце <body>, DOM уже готов).
const mapStage = document.getElementById("mapStage");
const floorButtons = document.querySelectorAll(".floor-switch__btn");

const startInput = document.getElementById("startInput");
const destInput = document.getElementById("destInput");
const startDatalist = document.getElementById("startDatalist");
const destDatalist = document.getElementById("destDatalist");

const buildRouteBtn = document.getElementById("buildRouteBtn");
const clearSelectionBtn = document.getElementById("clearSelectionBtn");
const finishRouteBtn = document.getElementById("finishRouteBtn");

const routeControls = document.getElementById("routeControls");
const routeStepLabel = document.getElementById("routeStepLabel");
const routeInstruction = document.getElementById("routeInstruction");
const routePrevBtn = document.getElementById("routePrevBtn");
const routeNextBtn = document.getElementById("routeNextBtn");

// ---- Глобальные настройки из floor_N_data.js (задаются один раз, в любом
// из файлов этажей — например в floor_1_data.js) ----
//
// MAP_FONT            — общий шрифт всех подписей на карте
// SHOW_GRAPH_POINTS   — true: на карте видны точки графа (двери + коридор)
//                       и связи между ними; false: обычный вид
// GRAPH_POINT_RADIUS  — радиус служебных точек, px
// GRAPH_POINT_COLOR   — цвет точек коридора
// GRAPH_DOOR_COLOR    — цвет точек-дверей
// ROUTE_COLOR         — цвет линии маршрута
// ROUTE_ANIM_SPEED    — скорость рисования линии маршрута (0 — без анимации)
// FLOOR_CHANGE_COST   — «стоимость» одного пролёта между этажами
const LABEL_FONT = window.MAP_FONT || "inherit";
const SHOW_GRAPH_POINTS = window.SHOW_GRAPH_POINTS || false;
const FLOOR_CHANGE_COST = window.FLOOR_CHANGE_COST || 120;

// Скорость «рисования» линии маршрута, в единицах карты в секунду
// (ширина карты — 1310). Больше — быстрее. 0 — без анимации.
// Меняется через window.ROUTE_ANIM_SPEED в любом floor_N_data.js.
const ROUTE_ANIM_SPEED = window.ROUTE_ANIM_SPEED ?? 500;
const ROUTE_ANIM_MIN_MS = 300;   // даже короткий отрезок рисуется не мгновенно
const ROUTE_ANIM_MAX_MS = 5000;  // и очень длинный не тянется бесконечно

// Лифты временно не участвуют в переходах между этажами — маршрут идёт
// только по лестницам. Чтобы включить лифты обратно, поставь false.
const ELEVATORS_DISABLED = true;

// Размер и цвета служебных точек и маршрута передаём в CSS-переменные —
// они используются в map.css (.corridor-node, .door-node, .route-path).
function applyCssSettings() {
  const root = document.documentElement.style;
  if (window.GRAPH_POINT_RADIUS) root.setProperty("--graph-point-radius", `${window.GRAPH_POINT_RADIUS}px`);
  if (window.GRAPH_POINT_COLOR) root.setProperty("--graph-point-color", window.GRAPH_POINT_COLOR);
  if (window.GRAPH_DOOR_COLOR) root.setProperty("--graph-door-color", window.GRAPH_DOOR_COLOR);
  if (window.ROUTE_COLOR) root.setProperty("--route-color", window.ROUTE_COLOR);
}
applyCssSettings();


/* ===================================================================
 * 2. СОСТОЯНИЕ
 * =================================================================== */

let currentFloor = 1;

// Выбор старта/финиша хранится парой {floor, roomId}: маршрут может идти
// между этажами, а id комнат на разных этажах повторяются (ELEV_1, "1"...).
let selStart = null; // { floor, roomId } | null
let selDest = null;  // { floor, roomId } | null

// Построенный маршрут, разбитый на шаги по этажам:
// [{ floor, points: [{x,y}, ...], exitNodeId }, ...]. null — пока не построен.
let routeSegments = null;
let routeStepIndex = 0;

// Открытое всплывающее окошко кабинета.
let activePopup = null;

// Текст в поле ввода -> {floor, id, label} (заполняется в populateRoomInputs).
let roomsByDisplay = new Map();


/* ===================================================================
 * 3. МЕЛКИЕ УТИЛИТЫ
 * =================================================================== */

function pointDist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function cssEscape(value) {
  return window.CSS && CSS.escape ? CSS.escape(value) : value.replace(/"/g, '\\"');
}

function allFloorNumbers() {
  return Object.keys(window.FLOORS || {}).map(Number).sort((a, b) => a - b);
}

function findRoom(floor, roomId) {
  return window.FLOORS[floor]?.rooms.find((r) => r.id === roomId);
}

// Двери кабинета в едином формате [{x,y}, ...] — и для room.door,
// и для room.doors.
function getRoomDoors(room) {
  if (room.doors && room.doors.length) return room.doors;
  if (room.door) return [room.door];
  return [];
}

// Индексы дверей, которые нарисованы на карте, но для маршрута не
// проходимы (room.blockedDoors: [1] — индекс в room.doors).
function blockedDoorIndices(room) {
  return room.blockedDoors || [];
}

function createSvgEl(tag, attrs = {}) {
  const el = document.createElementNS(svgNS, tag);
  Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
  return el;
}


/* ===================================================================
 * 4. ПОДПИСИ НА КАРТЕ
 * =================================================================== */

// Один canvas на всё приложение — для измерения ширины текста без DOM.
const measureCtx = document.createElement("canvas").getContext("2d");

function textWidth(str, fontSize, fontFamily) {
  measureCtx.font = `700 ${fontSize}px ${fontFamily === "inherit" ? "sans-serif" : fontFamily}`;
  return measureCtx.measureText(str).width;
}

// Жадный word-wrap: разбивает label на строки шириной не больше maxWidth.
function wrapLabel(label, fontSize, fontFamily, maxWidth) {
  const words = label.split(" ");
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (textWidth(candidate, fontSize, fontFamily) <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  });
  if (current) lines.push(current);

  return lines;
}

// Подбирает размер шрифта и переносы так, чтобы label влез в boxW x boxH:
// начинает с maxFontSize и уменьшает до minFontSize.
function fitLabel(label, boxW, boxH, fontFamily, maxFontSize = 22, minFontSize = 9) {
  const padding = 0.86; // запас от краёв фигуры
  const usableW = boxW * padding;
  const lineHeight = 1.15;

  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize--) {
    const lines = wrapLabel(label, fontSize, fontFamily, usableW);
    const totalH = lines.length * fontSize * lineHeight;
    const widestLine = Math.max(...lines.map((l) => textWidth(l, fontSize, fontFamily)));

    if (totalH <= boxH * padding && widestLine <= usableW) {
      return { fontSize, lines, lineHeight };
    }
  }

  // не влезло даже на минимальном шрифте — отдаём минимальный как есть
  return { fontSize: minFontSize, lines: wrapLabel(label, minFontSize, fontFamily, usableW), lineHeight };
}

// <text> с переносами (<tspan>), отцентрованный по (cx, cy) и вписанный
// в прямоугольник boxW x boxH.
function makeFittedText(cx, cy, boxW, boxH, label, className) {
  const { fontSize, lines, lineHeight } = fitLabel(label, boxW, boxH, LABEL_FONT);

  const text = createSvgEl("text", { class: className, x: cx, y: cy, "font-size": fontSize });
  if (LABEL_FONT !== "inherit") text.setAttribute("font-family", LABEL_FONT);

  const totalH = lines.length * fontSize * lineHeight;
  const firstLineY = cy - totalH / 2 + (fontSize * lineHeight) / 2;

  lines.forEach((line, i) => {
    const tspan = createSvgEl("tspan", { x: cx, y: firstLineY + i * fontSize * lineHeight });
    tspan.textContent = line;
    text.appendChild(tspan);
  });

  return text;
}

// Подпись для фигур с ручными настройками (notch-rect, frame):
// room.labelX/labelY — центр, room.labelBoxW/labelBoxH — рамка под текст.
function makeCustomLabel(room) {
  const cx = room.labelX ?? (room.x + room.w / 2);
  const cy = room.labelY ?? (room.y + room.h / 2);
  return makeFittedText(cx, cy, room.labelBoxW || room.w, room.labelBoxH || room.h, room.label, "room-label");
}


/* ===================================================================
 * 5. ГЕОМЕТРИЯ ФИГУР
 * =================================================================== */

// ---- Скошенная верхняя грань (slant-top) ----

// y линии line = {x1,y1,x2,y2} в точке x.
function slantYAt(line, x) {
  return line.y1 + (line.y2 - line.y1) * ((x - line.x1) / (line.x2 - line.x1));
}

// Точки прямоугольника x,y,w,h, верхняя грань которого идёт по общей линии
// line. Соседние кабинеты получают один и тот же line, поэтому их срезы
// продолжают друг друга в одну непрерывную диагональ.
function slantTopPoints(x, y, w, h, line) {
  return [
    [x, slantYAt(line, x)],
    [x + w, slantYAt(line, x + w)],
    [x + w, y + h],
    [x, y + h],
  ].map((p) => p.join(",")).join(" ");
}

// Раздаёт комнатам из data.slants общие линии среза (room.line).
// Формат группы: ["id1", "id2", ..., rise, run]
//   rise — высота подъёма среза у ПЕРВОГО id;
//   run  — горизонтальная длина ската, фиксированная (не зависит от числа
//          и ширины кабинетов), поэтому одинаковые rise+run на разных
//          этажах дают одинаковый угол.
function applySlants(data) {
  if (!data.slants) return;

  data.slants.forEach((group) => {
    const run = group[group.length - 1];
    const rise = group[group.length - 2];
    const rooms = group
      .slice(0, -2)
      .map((id) => data.rooms.find((r) => r.id === id))
      .filter(Boolean);

    if (rooms.length < 1) return;

    // один и тот же объект line для всей группы — срезы стыкуются без разрыва
    const line = { x1: rooms[0].x, y1: rise, x2: rooms[0].x + run, y2: 0 };
    rooms.forEach((room) => {
      room.line = line;
    });
  });
}

// ---- Прямоугольники со скруглёнными углами ----

// Контур прямоугольника x,y,w,h с углами радиуса r (для рамки и отверстия).
function roundedRectOutline(x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  const x2 = x + w, y2 = y + h;
  if (rr === 0) {
    return `M ${x} ${y} H ${x2} V ${y2} H ${x} Z`;
  }
  return `M ${x + rr} ${y} H ${x2 - rr} A ${rr} ${rr} 0 0 1 ${x2} ${y + rr} V ${y2 - rr} A ${rr} ${rr} 0 0 1 ${x2 - rr} ${y2} H ${x + rr} A ${rr} ${rr} 0 0 1 ${x} ${y2 - rr} V ${y + rr} A ${rr} ${rr} 0 0 1 ${x + rr} ${y} Z`;
}

// Скругляет ВСЕ углы произвольного полигона (points — массив [x,y]) на
// radius (ограничен половиной соседних рёбер); работает и для вогнутых углов.
function roundedPolygonPath(points, radius) {
  const n = points.length;
  const corners = points.map((curr, i) => {
    const prev = points[(i - 1 + n) % n];
    const next = points[(i + 1) % n];

    const d1x = curr[0] - prev[0], d1y = curr[1] - prev[1];
    const len1 = Math.hypot(d1x, d1y) || 1;
    const d2x = next[0] - curr[0], d2y = next[1] - curr[1];
    const len2 = Math.hypot(d2x, d2y) || 1;

    const r = Math.max(0, Math.min(radius, len1 / 2, len2 / 2));

    return {
      enter: [curr[0] - (d1x / len1) * r, curr[1] - (d1y / len1) * r],
      corner: curr,
      exit: [curr[0] + (d2x / len2) * r, curr[1] + (d2y / len2) * r],
    };
  });

  let d = `M ${corners[0].enter[0]} ${corners[0].enter[1]} `;
  corners.forEach((c, i) => {
    d += `Q ${c.corner[0]} ${c.corner[1]} ${c.exit[0]} ${c.exit[1]} `;
    const nextEnter = corners[(i + 1) % n].enter;
    d += `L ${nextEnter[0]} ${nextEnter[1]} `;
  });
  return `${d}Z`;
}

// ---- notch-rect: прямоугольник с вырезом с края ----

/**
 * Прямоугольник x,y,w,h с прямоугольным вырезом notch = {x,y,w,h} (в общих
 * координатах карты; вырез обрезается по границе фигуры) — L- или U-образная
 * форма, когда соседний кабинет «вгрызается» в угол или край комнаты.
 * Строится ОДИН непрерывный контур, поэтому кликабельная область точно
 * совпадает с видимой.
 *
 * Поддерживается: вырез в углу (L-форма), посреди стороны (U-форма) и
 * сквозной через всю ширину/высоту (комната делится на 2 куска, оба —
 * один кабинет). Вырез целиком внутри — это отверстие, для него есть "frame".
 */
function notchRectPath(x, y, w, h, notch, radius = 6) {
  if (!notch) return roundedRectOutline(x, y, w, h, radius);

  const x2 = x + w, y2 = y + h;
  const nx1 = Math.max(x, notch.x);
  const ny1 = Math.max(y, notch.y);
  const nx2 = Math.min(x2, notch.x + notch.w);
  const ny2 = Math.min(y2, notch.y + notch.h);

  if (nx2 <= nx1 || ny2 <= ny1) return roundedRectOutline(x, y, w, h, radius); // не пересекается

  const eps = 0.001;
  const touchesLeft = nx1 <= x + eps;
  const touchesRight = nx2 >= x2 - eps;
  const touchesTop = ny1 <= y + eps;
  const touchesBottom = ny2 >= y2 - eps;

  // сквозной вырез — делит комнату на 2 куска
  if (touchesLeft && touchesRight) {
    const parts = [];
    if (ny1 > y) parts.push(roundedRectOutline(x, y, w, ny1 - y, radius));
    if (ny2 < y2) parts.push(roundedRectOutline(x, ny2, w, y2 - ny2, radius));
    return parts.join(" ") || roundedRectOutline(x, y, w, h, radius);
  }
  if (touchesTop && touchesBottom) {
    const parts = [];
    if (nx1 > x) parts.push(roundedRectOutline(x, y, nx1 - x, h, radius));
    if (nx2 < x2) parts.push(roundedRectOutline(nx2, y, x2 - nx2, h, radius));
    return parts.join(" ") || roundedRectOutline(x, y, w, h, radius);
  }

  let points = null;

  if (touchesLeft && touchesTop) points = [[x, y2], [x, ny2], [nx2, ny2], [nx2, y], [x2, y], [x2, y2]];
  else if (touchesRight && touchesTop) points = [[x, y], [nx1, y], [nx1, ny2], [x2, ny2], [x2, y2], [x, y2]];
  else if (touchesRight && touchesBottom) points = [[x, y], [x2, y], [x2, ny1], [nx1, ny1], [nx1, y2], [x, y2]];
  else if (touchesLeft && touchesBottom) points = [[x2, y], [x2, y2], [nx2, y2], [nx2, ny1], [x, ny1], [x, y]];
  else if (touchesTop) points = [[x, y], [nx1, y], [nx1, ny2], [nx2, ny2], [nx2, y], [x2, y], [x2, y2], [x, y2]];
  else if (touchesBottom) points = [[x, y], [x2, y], [x2, y2], [nx2, y2], [nx2, ny1], [nx1, ny1], [nx1, y2], [x, y2]];
  else if (touchesLeft) points = [[x, y], [x2, y], [x2, y2], [x, y2], [x, ny2], [nx2, ny2], [nx2, ny1], [x, ny1]];
  else if (touchesRight) points = [[x, y], [nx1, y], [nx1, ny1], [x2, ny1], [x2, ny2], [nx1, ny2], [nx1, y2], [x, y2]];

  if (!points) return roundedRectOutline(x, y, w, h, radius); // вырез внутри — см. "frame"

  return roundedPolygonPath(points, radius);
}

// ---- frame: прямоугольник с отверстием ----

/**
 * «Рамка» — прямоугольник x,y,w,h с отверстием внутри. borderWidth — толщина
 * рамки, одинаковая со всех сторон. Возвращает d-путь для fill-rule="evenodd":
 * внешний контур + контур отверстия.
 */
function framePath(x, y, w, h, borderWidth, radius = 6) {
  const bw = Math.max(0, Math.min(borderWidth, w / 2 - 1, h / 2 - 1));
  const innerR = Math.max(0, radius - bw);
  const outer = roundedRectOutline(x, y, w, h, radius);
  const inner = roundedRectOutline(x + bw, y + bw, w - 2 * bw, h - 2 * bw, innerR);
  return `${outer} ${inner}`;
}

// ---- round-rect: одна сторона скруглена дугой ----

/**
 * Прямоугольник x,y,w,h, у которого сторона side ("top"/"bottom"/"left"/
 * "right") целиком скруглена дугой. radius — глубина дуги внутрь (ограничен
 * размером комнаты); при radius = половине ширины/высоты получается
 * идеальный полукруг. Противоположная сторона остаётся прямой.
 */
function roundedSidePath(x, y, w, h, side, radius) {
  const x2 = x + w;
  const y2 = y + h;

  if (side === "top") {
    const r = Math.max(0, Math.min(radius, h));
    return `M ${x} ${y2} L ${x} ${y + r} A ${w / 2} ${r} 0 0 1 ${x2} ${y + r} L ${x2} ${y2} Z`;
  }
  if (side === "bottom") {
    const r = Math.max(0, Math.min(radius, h));
    return `M ${x} ${y} L ${x2} ${y} L ${x2} ${y2 - r} A ${w / 2} ${r} 0 0 0 ${x} ${y2 - r} Z`;
  }
  if (side === "left") {
    const r = Math.max(0, Math.min(radius, w));
    return `M ${x2} ${y} L ${x2} ${y2} L ${x + r} ${y2} A ${r} ${h / 2} 0 0 1 ${x + r} ${y} Z`;
  }
  // right
  const r = Math.max(0, Math.min(radius, w));
  return `M ${x} ${y} L ${x2 - r} ${y} A ${r} ${h / 2} 0 0 1 ${x2 - r} ${y2} L ${x} ${y2} Z`;
}

// Центр и размер бокса под подпись для round-rect по умолчанию: дуга лежит
// в полосе радиуса r у скруглённой стороны, подпись ставится в оставшуюся
// «плоскую» часть. Переопределяется через room.labelX/labelY/labelBoxW/labelBoxH.
function roundedRectLabelBox(room) {
  const isSideways = room.roundSide === "left" || room.roundSide === "right";
  const r = Math.max(0, Math.min(room.roundRadius, isSideways ? room.w : room.h));
  const x2 = room.x + room.w;
  const y2 = room.y + room.h;

  switch (room.roundSide) {
    case "top": {
      const safeTop = room.y + r;
      return { cx: room.x + room.w / 2, cy: (safeTop + y2) / 2, boxW: room.w, boxH: y2 - safeTop };
    }
    case "bottom": {
      const safeBottom = y2 - r;
      return { cx: room.x + room.w / 2, cy: (room.y + safeBottom) / 2, boxW: room.w, boxH: safeBottom - room.y };
    }
    case "left": {
      const safeLeft = room.x + r;
      return { cx: (safeLeft + x2) / 2, cy: room.y + room.h / 2, boxW: x2 - safeLeft, boxH: room.h };
    }
    case "right": {
      const safeRight = x2 - r;
      return { cx: (room.x + safeRight) / 2, cy: room.y + room.h / 2, boxW: safeRight - room.x, boxH: room.h };
    }
    default:
      return { cx: room.x + room.w / 2, cy: room.y + room.h / 2, boxW: room.w, boxH: room.h };
  }
}


/* ===================================================================
 * 6. ГРАФ И МАРШРУТИЗАЦИЯ
 * =================================================================== */

// ---- 6.1 Граф одного этажа ----

// Точка коридора, к которой цепляется дверь кабинета:
//  1) узел с forRoom === roomId (и forDoor, если задан и совпал с doorIndex);
//  2) иначе — ближайший к двери узел коридора.
function findCorridorTarget(data, roomId, doorPoint, doorIndex) {
  let target = data.corridor.nodes.find(
    (n) => n.forRoom === roomId && (n.forDoor === undefined || n.forDoor === doorIndex)
  );
  if (!target) {
    target = data.corridor.nodes.reduce((best, n) => {
      const d = pointDist(n, doorPoint);
      return !best || d < best.d ? { ...n, d } : best;
    }, null);
  }
  return target;
}

/**
 * Граф маршрутизации ОДНОГО этажа: точки коридора (data.corridor) + двери
 * кабинетов (room.door / room.doors), каждая дверь связана со «своей»
 * точкой коридора.
 *
 * Возвращает { nodes: {id: {x,y}}, edges: [[id1, id2, вес], ...] }.
 * id двери: "door:<roomId>" (одна дверь) или "door:<roomId>:<i>" (несколько).
 */
function buildGraph(data) {
  const nodes = {};
  const edges = [];

  data.corridor.nodes.forEach((n) => {
    nodes[n.id] = { x: n.x, y: n.y };
  });
  data.corridor.edges.forEach(([a, b]) => {
    if (!nodes[a] || !nodes[b]) return;
    edges.push([a, b, pointDist(nodes[a], nodes[b])]);
  });

  data.rooms.forEach((room) => {
    const doors = getRoomDoors(room);
    if (!doors.length) return;
    const roomDoorId = `door:${room.id}`;

    if (doors.length === 1) {
      nodes[roomDoorId] = { x: doors[0].x, y: doors[0].y };
      const target = findCorridorTarget(data, room.id, doors[0], 0);
      if (target) edges.push([roomDoorId, target.id, pointDist(nodes[roomDoorId], nodes[target.id])]);
      return;
    }

    // Несколько дверей: у каждой свой узел и своя точка коридора; какую
    // дверь использовать как старт/финиш, решает дейкстра (doorCandidates).
    // Дверь из blockedDoors в граф не попадает вовсе.
    const blocked = blockedDoorIndices(room);
    const doorIds = [];
    doors.forEach((door, i) => {
      if (blocked.includes(i)) return;
      const doorId = `${roomDoorId}:${i}`;
      nodes[doorId] = { x: door.x, y: door.y };
      const target = findCorridorTarget(data, room.id, door, i);
      if (target) edges.push([doorId, target.id, pointDist(nodes[doorId], nodes[target.id])]);
      doorIds.push(doorId);
    });

    // ПРОХОДНАЯ комната (room.through: true): двери связаны реальным
    // расстоянием — идти «насквозь» можно, но только если это короче обхода
    // по коридору. Без through двери между собой не связаны.
    if (room.through) {
      for (let i = 0; i < doorIds.length; i++) {
        for (let j = i + 1; j < doorIds.length; j++) {
          edges.push([doorIds[i], doorIds[j], pointDist(nodes[doorIds[i]], nodes[doorIds[j]])]);
        }
      }
    }
  });

  return { nodes, edges };
}

// id узлов графа этажа, через которые можно войти/выйти из комнаты.
// Для комнаты с несколькими дверями — каждая дверь отдельным кандидатом.
function doorCandidates(data, roomId) {
  const room = data.rooms.find((r) => r.id === roomId);
  if (!room) return [];
  const doors = getRoomDoors(room);
  if (doors.length <= 1) return [`door:${roomId}`];
  const blocked = blockedDoorIndices(room);
  return doors
    .map((_, i) => `door:${roomId}:${i}`)
    .filter((_, i) => !blocked.includes(i));
}

// Индекс двери из id узла: "door:ROOM" -> 0, "door:ROOM:2" -> 2.
function doorIndexFromId(doorId) {
  const parts = doorId.split(":");
  return parts.length >= 3 ? Number(parts[2]) : 0;
}

// id кабинета из id узла: "door:ROOM" / "door:ROOM:2" -> "ROOM"; для точки
// коридора вернёт null.
function parseRoomIdFromNodeId(nodeId) {
  if (!nodeId) return null;
  const parts = nodeId.split(":");
  return parts[0] === "door" ? parts[1] : null;
}

// ---- 6.2 Дейкстра ----

// Возвращает { path: [id, ...], distance } или null, если пути нет.
function dijkstra(graph, startId, endId) {
  if (!graph.nodes[startId] || !graph.nodes[endId]) return null;

  const adjacency = {};
  graph.edges.forEach(([a, b, w]) => {
    (adjacency[a] = adjacency[a] || []).push([b, w]);
    (adjacency[b] = adjacency[b] || []).push([a, w]);
  });

  const dist = {};
  const prev = {};
  const visited = new Set();
  Object.keys(graph.nodes).forEach((id) => (dist[id] = Infinity));
  dist[startId] = 0;

  while (true) {
    let current = null;
    let best = Infinity;
    for (const id in dist) {
      if (!visited.has(id) && dist[id] < best) {
        best = dist[id];
        current = id;
      }
    }
    if (current === null || current === endId) break;

    visited.add(current);
    (adjacency[current] || []).forEach(([next, w]) => {
      const alt = dist[current] + w;
      if (alt < dist[next]) {
        dist[next] = alt;
        prev[next] = current;
      }
    });
  }

  if (dist[endId] === Infinity) return null;

  const path = [];
  let step = endId;
  while (step !== undefined) {
    path.unshift(step);
    step = prev[step];
  }
  return { path, distance: dist[endId] };
}

// ---- 6.3 Граф всех этажей (лестницы/лифты связывают этажи) ----
//
// Одинаковый room.id у кабинета type: "stairs" (или "ELEV_*") на двух
// СОСЕДНИХ этажах — это одна и та же лестница/лифт; связь строится
// автоматически. Если пройти можно не в обе стороны, у room на нужном этаже
// ставится  noUp: true  (отсюда наверх нельзя)  или  noDown: true  (вниз).
//
// Двери соединяются строго по одинаковому индексу (левая с левой, правая
// с правой), поэтому порядок дверей в room.doors должен совпадать на всех
// этажах, где встречается эта лестница.

function prefixNode(floor, nodeId) {
  return `${floor}::${nodeId}`;
}

// Лестницы/лифты со всех этажей, сгруппированные по id:
// id -> [{floor, room}, ...] (по возрастанию этажа).
function collectVerticalConnectors(floors) {
  const byId = {};
  floors.forEach((floor) => {
    window.FLOORS[floor].rooms.forEach((room) => {
      const isElevator = room.id.indexOf("ELEV_") === 0;
      const isVertical = room.type === "stairs" || (isElevator && !ELEVATORS_DISABLED);
      if (!isVertical) return;
      if (!getRoomDoors(room).length) return;
      (byId[room.id] = byId[room.id] || []).push({ floor, room });
    });
  });
  Object.values(byId).forEach((instances) => instances.sort((a, b) => a.floor - b.floor));
  return byId;
}

/**
 * Один граф по всем этажам: граф каждого этажа (id узлов с префиксом этажа)
 * + «вертикальные» рёбра между одноимёнными лестницами соседних этажей.
 * Возвращает { nodes, edges, floorOf } — floorOf[id с префиксом] = этаж
 * (нужно, чтобы разрезать найденный путь на отрезки по этажам).
 */
function buildGlobalGraph() {
  const nodes = {};
  const edges = [];
  const floorOf = {};
  const floors = allFloorNumbers();

  floors.forEach((floor) => {
    const graph = buildGraph(window.FLOORS[floor]);
    Object.keys(graph.nodes).forEach((id) => {
      const pid = prefixNode(floor, id);
      nodes[pid] = graph.nodes[id];
      floorOf[pid] = floor;
    });
    graph.edges.forEach(([a, b, w]) => {
      edges.push([prefixNode(floor, a), prefixNode(floor, b), w]);
    });
  });

  Object.values(collectVerticalConnectors(floors)).forEach((instances) => {
    for (let i = 0; i < instances.length - 1; i++) {
      const lower = instances[i];
      const upper = instances[i + 1];
      if (upper.floor - lower.floor !== 1) continue; // не соседние этажи — не связываем
      if (lower.room.noUp) continue;
      if (upper.room.noDown) continue;

      const lowerDoors = doorCandidates(window.FLOORS[lower.floor], lower.room.id);
      const upperDoors = doorCandidates(window.FLOORS[upper.floor], upper.room.id);

      lowerDoors.forEach((ld) => {
        const li = doorIndexFromId(ld);
        const match = upperDoors.find((ud) => doorIndexFromId(ud) === li);
        if (match) {
          edges.push([prefixNode(lower.floor, ld), prefixNode(upper.floor, match), FLOOR_CHANGE_COST]);
        }
      });
    }
  });

  return { nodes, edges, floorOf };
}


/* ===================================================================
 * 7. ПОСТРОЕНИЕ МАРШРУТА И ТЕКСТ ПОДСКАЗОК
 * =================================================================== */

function selectionIsComplete() {
  return !!(selStart && selDest);
}

// Кратчайший путь между выбранными комнатами: перебираем все пары
// «дверь старта — дверь финиша». null, если пути нет.
function findBestPath(graph) {
  const toGraphIds = (sel) =>
    doorCandidates(window.FLOORS[sel.floor], sel.roomId).map((id) => prefixNode(sel.floor, id));

  let best = null;
  toGraphIds(selStart).forEach((s) => {
    toGraphIds(selDest).forEach((d) => {
      const result = dijkstra(graph, s, d);
      if (result && (!best || result.distance < best.distance)) best = result;
    });
  });
  return best;
}

// Режет единый путь на «сырые» отрезки по этажам; у каждой точки хранится
// nodeId (без префикса этажа) — по нему потом узнаём, через какую
// лестницу идёт переход.
function splitPathByFloors(path, graph) {
  const segments = [];
  let current = null;
  path.forEach((pid) => {
    const floor = graph.floorOf[pid];
    const point = graph.nodes[pid];
    const nodeId = pid.slice(pid.indexOf("::") + 2);
    if (!current || current.floor !== floor) {
      current = { floor, points: [] };
      segments.push(current);
    }
    current.points.push({ x: point.x, y: point.y, nodeId });
  });
  return segments;
}

// Превращает сырые отрезки в шаги для пользователя.
// «Проходной» этаж — где маршрут не идёт по коридору, а просто продолжает
// ту же лестницу (на этаже единственная точка — дверь лестницы). Такие
// этажи отдельным шагом не показываем, чтобы не нажимать «Дальше» на
// каждый пролёт. Затем первая точка следующего шага дописывается в конец
// текущего, чтобы линия доходила до самой лестницы.
function collapseToSteps(rawSegments) {
  const steps = [];
  rawSegments.forEach((seg, idx) => {
    const isLast = idx === rawSegments.length - 1;
    if (seg.points.length === 1 && steps.length > 0 && !isLast) return;
    steps.push({
      floor: seg.floor,
      points: seg.points.map((p) => ({ x: p.x, y: p.y })),
      exitNodeId: seg.points[seg.points.length - 1].nodeId,
    });
  });

  for (let i = 0; i < steps.length - 1; i++) {
    steps[i].points.push(steps[i + 1].points[0]);
  }
  return steps;
}

function buildFullRoute() {
  if (!selectionIsComplete()) return;

  const graph = buildGlobalGraph();
  const best = findBestPath(graph);

  if (!best) {
    routeSegments = null;
    updateRouteControls();
    alert("Не удалось построить маршрут между выбранными точками.");
    return;
  }

  routeSegments = collapseToSteps(splitPathByFloors(best.path, graph));
  routeStepIndex = 0;
  renderRouteStep();
}

// Короткий текст «что сделать на этом шаге»: последний шаг — дойти до
// кабинета; остальные — дойти до лестницы/лифта и подняться/спуститься.
function stepInstructionText(idx) {
  if (!routeSegments || !routeSegments[idx]) return "";
  const step = routeSegments[idx];
  const isLast = idx === routeSegments.length - 1;

  if (isLast) {
    const destRoom = selDest && findRoom(selDest.floor, selDest.roomId);
    const label = destRoom ? (destRoom.label || destRoom.id) : "";
    return `Дойдите до кабинета ${label}.`;
  }

  const nextFloor = routeSegments[idx + 1].floor;
  const connectorRoomId = parseRoomIdFromNodeId(step.exitNodeId);
  const connectorRoom = findRoom(step.floor, connectorRoomId);
  const isElevator = !!connectorRoomId && connectorRoomId.indexOf("ELEV_") === 0;
  const number = isElevator ? connectorRoomId.replace("ELEV_", "") : (connectorRoom?.label || connectorRoomId || "");
  const connectorPhrase = isElevator ? `лифта ${number}` : `лестницы ${number}`;
  const dirVerb = nextFloor > step.floor ? "поднимитесь" : "спуститесь";

  return `Дойдите до ${connectorPhrase} и ${dirVerb} на ${nextFloor} этаж.`;
}


/* ===================================================================
 * 8. ОТРИСОВКА ЭТАЖА
 * =================================================================== */

// ---- 8.1 Фигуры кабинетов (по одной функции на shape) ----

// shape: "rect" и "slant-top" (+ значок для лестниц)
function renderRectRoom(g, room) {
  let shapeEl;

  if (room.shape === "rect") {
    shapeEl = createSvgEl("rect", { x: room.x, y: room.y, width: room.w, height: room.h, rx: 6 });
  } else {
    // slant-top: верхняя грань идёт по общей линии room.line (см. applySlants)
    shapeEl = createSvgEl("polygon", { points: slantTopPoints(room.x, room.y, room.w, room.h, room.line) });
  }
  shapeEl.setAttribute("class", room.type === "stairs" ? "room room--stairs" : "room");
  g.appendChild(shapeEl);

  // центр подписи считаем по РЕАЛЬНО нарисованной фигуре
  const labelCx = room.x + room.w / 2;
  let labelCy = room.y + room.h / 2;

  if (room.shape === "slant-top") {
    // середина между скошенной верхней гранью (в точке x центра) и низом
    labelCy = (slantYAt(room.line, labelCx) + (room.y + room.h)) / 2;
  }

  if (room.type === "stairs") {
    g.appendChild(makeStairsIcon(labelCx, labelCy, Math.min(room.w, room.h)));
    // освобождаем место значку — подпись ниже центра
    labelCy += Math.min(room.w, room.h) * 0.32;
  }

  const text = makeFittedText(labelCx, labelCy, room.w, room.h, room.label, "room-label");

  // labelRotate — поворот подписи в градусах (например -90 — снизу вверх)
  // вокруг её же центра, поэтому текст остаётся по центру фигуры.
  if (room.labelRotate) {
    text.setAttribute("transform", `rotate(${room.labelRotate} ${labelCx} ${labelCy})`);
  }

  g.appendChild(text);
}

// Значок ступенек «лесенкой» по центру фигуры.
function makeStairsIcon(cx, cy, minSide) {
  const s = minSide * 0.22; // шаг ступеньки
  const startX = cx - s * 1.5;
  const startY = cy + s * 1.5;
  const points = [
    [startX, startY],
    [startX, startY - s],
    [startX + s, startY - s],
    [startX + s, startY - s * 2],
    [startX + s * 2, startY - s * 2],
    [startX + s * 2, startY - s * 3],
    [startX + s * 3, startY - s * 3],
  ];
  return createSvgEl("polyline", {
    class: "stairs-icon",
    points: points.map((p) => p.join(",")).join(" "),
  });
}

// shape: "notch-rect"
function renderNotchRoom(g, room) {
  g.appendChild(createSvgEl("path", {
    class: "room",
    d: notchRectPath(room.x, room.y, room.w, room.h, room.notch, room.notchRadius ?? 6),
  }));
  if (room.label) g.appendChild(makeCustomLabel(room));
}

// shape: "frame"
function renderFrameRoom(g, room) {
  // Невидимый прямоугольник на всю площадь, включая отверстие: без него
  // клик по пустой середине никуда бы не попадал (см. .frame-hit-area).
  g.appendChild(createSvgEl("rect", {
    x: room.x, y: room.y, width: room.w, height: room.h,
    fill: "transparent",
    class: "frame-hit-area",
  }));

  g.appendChild(createSvgEl("path", {
    class: "room",
    "fill-rule": "evenodd",
    d: framePath(room.x, room.y, room.w, room.h, room.borderWidth, room.frameRadius ?? 6),
  }));
  if (room.label) g.appendChild(makeCustomLabel(room));
}

// shape: "round-rect" (room.roundSide — какая сторона скруглена,
// room.roundRadius — насколько)
function renderRoundRoom(g, room) {
  g.appendChild(createSvgEl("path", {
    class: "room",
    d: roundedSidePath(room.x, room.y, room.w, room.h, room.roundSide, room.roundRadius),
  }));

  const box = roundedRectLabelBox(room);
  const cx = room.labelX != null ? room.labelX : box.cx;
  const cy = room.labelY != null ? room.labelY : box.cy;
  const boxW = room.labelBoxW || box.boxW;
  const boxH = room.labelBoxH || box.boxH;
  g.appendChild(makeFittedText(cx, cy, boxW, boxH, room.label, "room-label"));
}

// shape: "path" (произвольный контур, например атриум); labelBoxW/H —
// рамка под подпись, задаётся вручную (по сложной фигуре её не посчитать).
function renderPathRoom(g, room) {
  g.appendChild(createSvgEl("path", { class: "atrium", d: room.d }));

  const boxW = room.labelBoxW || 220;
  const boxH = room.labelBoxH || 100;
  g.appendChild(makeFittedText(room.labelX, room.labelY, boxW, boxH, room.label, "atrium-label"));
}

const ROOM_RENDERERS = {
  "rect": renderRectRoom,
  "slant-top": renderRectRoom,
  "notch-rect": renderNotchRoom,
  "frame": renderFrameRoom,
  "round-rect": renderRoundRoom,
  "path": renderPathRoom,
};

function renderRooms(svg, data) {
  data.rooms.forEach((room) => {
    const g = createSvgEl("g", { class: "room-group" });
    g.dataset.roomId = room.id;

    const renderShape = ROOM_RENDERERS[room.shape];
    if (renderShape) renderShape(g, room);

    g.addEventListener("click", () => openRoomPopup(g, room));
    svg.appendChild(g);
  });
}

// ---- 8.2 Служебные точки графа (видимость — через SHOW_GRAPH_POINTS) ----

function renderGraphDebug(svg, data) {
  const group = createSvgEl("g");
  const nodesById = new Map(data.corridor.nodes.map((n) => [n.id, n]));

  data.corridor.edges.forEach(([fromId, toId]) => {
    const from = nodesById.get(fromId);
    const to = nodesById.get(toId);
    if (!from || !to) return;
    group.appendChild(createSvgEl("line", {
      class: "corridor-edge", x1: from.x, y1: from.y, x2: to.x, y2: to.y,
    }));
  });

  data.corridor.nodes.forEach((node) => {
    group.appendChild(createSvgEl("circle", { class: "corridor-node", cx: node.x, cy: node.y }));
  });

  // двери кабинетов + связь с их точкой коридора
  data.rooms.forEach((room) => {
    const blocked = blockedDoorIndices(room);

    getRoomDoors(room).forEach((door, i) => {
      const isBlocked = blocked.includes(i);
      const target = !isBlocked && findCorridorTarget(data, room.id, door, i);

      if (target) {
        group.appendChild(createSvgEl("line", {
          class: "door-edge", x1: door.x, y1: door.y, x2: target.x, y2: target.y,
        }));
      }

      // заблокированная дверь в debug-режиме красная и без связи с коридором
      group.appendChild(createSvgEl("circle", {
        class: isBlocked ? "door-node door-node--blocked" : "door-node",
        cx: door.x, cy: door.y,
      }));
    });
  });

  svg.appendChild(group);
}

// ---- 8.3 Подсветка и линия маршрута ----

// Подсвечивает is-start/is-dest у комнат ТЕКУЩЕГО этажа по selStart/selDest.
function applyHighlight() {
  mapStage.querySelectorAll(".is-start, .is-dest").forEach((el) => {
    el.classList.remove("is-start", "is-dest");
  });

  [[selStart, "is-start"], [selDest, "is-dest"]].forEach(([sel, className]) => {
    if (!sel || sel.floor !== currentFloor) return;
    const g = mapStage.querySelector(`.room-group[data-room-id="${cssEscape(sel.roomId)}"]`);
    g?.querySelector(".room, .atrium")?.classList.add(className);
  });
}

// Рисует линию маршрута и плавно «прочерчивает» её от начала к концу
// (через stroke-dashoffset). Без анимации линия появляется сразу — если
// скорость 0, у пользователя включено «уменьшить движение» или браузер
// не умеет Web Animations / getTotalLength.
function drawRoutePolyline(points) {
  const svg = mapStage.querySelector(".floor-svg");
  if (!svg) return;
  svg.querySelector(".route-path")?.remove(); // вместе с ним обрывается и старая анимация

  const polyline = createSvgEl("polyline", {
    class: "route-path",
    points: points.map((p) => `${p.x},${p.y}`).join(" "),
  });
  svg.appendChild(polyline);

  animateRoutePath(polyline);
}

function animateRoutePath(polyline) {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!ROUTE_ANIM_SPEED || reduceMotion) return;
  if (typeof polyline.animate !== "function" || typeof polyline.getTotalLength !== "function") return;

  const length = polyline.getTotalLength();
  if (!length) return;

  const duration = Math.min(ROUTE_ANIM_MAX_MS, Math.max(ROUTE_ANIM_MIN_MS, (length / ROUTE_ANIM_SPEED) * 1000));

  // один «штрих» длиной с всю линию, сдвинутый за начало — линию не видно;
  // сдвиг до 0 постепенно открывает её
  polyline.style.strokeDasharray = `${length}`;
  const animation = polyline.animate(
    [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
    { duration, easing: "linear" }
  );
  animation.onfinish = () => {
    polyline.style.strokeDasharray = ""; // дальше обычная сплошная линия
  };
}

function clearRoutePolyline() {
  mapStage.querySelector(".floor-svg .route-path")?.remove();
}

// ---- 8.4 Главная функция отрисовки этажа ----

function renderFloor(floorNumber) {
  currentFloor = floorNumber;
  const data = window.FLOORS && window.FLOORS[floorNumber];

  mapStage.innerHTML = "";
  closePopup();

  if (!data) {
    mapStage.innerHTML = `<p class="map-placeholder--loading">Этаж ${floorNumber} ещё не размечен</p>`;
    return;
  }

  const svg = createSvgEl("svg", {
    class: "floor-svg",
    viewBox: `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`,
    preserveAspectRatio: "none",
  });

  applySlants(data);
  renderRooms(svg, data);
  renderGraphDebug(svg, data);

  mapStage.appendChild(svg);
  mapStage.classList.toggle("debug-points", SHOW_GRAPH_POINTS);

  applyHighlight();

  // если на этом этаже сейчас показан шаг построенного маршрута —
  // дорисовываем его поверх свежепостроенного SVG
  const step = routeSegments && routeSegments[routeStepIndex];
  if (step && step.floor === floorNumber) {
    drawRoutePolyline(step.points);
  }
}

function setActiveFloorButton(floorNumber) {
  floorButtons.forEach((b) => {
    b.classList.toggle("floor-switch__btn--active", Number(b.dataset.floor) === floorNumber);
  });
}


/* ===================================================================
 * 9. ПОПАП КАБИНЕТА
 * =================================================================== */

function closePopup() {
  if (activePopup) activePopup.remove();
  activePopup = null;
}

// Ставит попап рядом с кабинетом: пробует стороны по приоритету
// (верх, низ, право, лево) и берёт первую, где он помещается целиком;
// если нигде — сторону с максимумом места. Края экрана — жёсткая граница.
function positionPopup(popup, roomRect) {
  const gap = 10;        // отступ от кабинета
  const pageMargin = 8;  // отступ от краёв экрана
  const popupRect = popup.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const space = {
    top: roomRect.top,
    bottom: vh - roomRect.bottom,
    right: vw - roomRect.right,
    left: roomRect.left,
  };
  const fits = {
    top: space.top >= popupRect.height + gap + pageMargin,
    bottom: space.bottom >= popupRect.height + gap + pageMargin,
    right: space.right >= popupRect.width + gap + pageMargin,
    left: space.left >= popupRect.width + gap + pageMargin,
  };

  let side = ["top", "bottom", "right", "left"].find((s) => fits[s]);
  if (!side) {
    side = Object.entries(space).sort((a, b) => b[1] - a[1])[0][0];
  }

  const clampX = (x) => Math.min(Math.max(x, pageMargin), vw - popupRect.width - pageMargin);
  const clampY = (y) => Math.min(Math.max(y, pageMargin), vh - popupRect.height - pageMargin);

  let left, top;
  if (side === "top" || side === "bottom") {
    left = clampX(roomRect.left + roomRect.width / 2 - popupRect.width / 2);
    top = clampY(side === "top" ? roomRect.top - gap - popupRect.height : roomRect.bottom + gap);
  } else {
    top = clampY(roomRect.top + roomRect.height / 2 - popupRect.height / 2);
    left = clampX(side === "right" ? roomRect.right + gap : roomRect.left - gap - popupRect.width);
  }

  popup.classList.add(`room-popup--${side}`);
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  popup.style.visibility = "visible";
}

function openRoomPopup(groupEl, room) {
  closePopup();

  const roomRect = groupEl.querySelector(".room, .atrium").getBoundingClientRect();

  const isStart = !!(selStart && selStart.floor === currentFloor && selStart.roomId === room.id);
  const isDest = !!(selDest && selDest.floor === currentFloor && selDest.roomId === room.id);

  const popup = document.createElement("div");
  popup.className = "room-popup";
  popup.style.visibility = "hidden"; // сначала измеряем, потом показываем
  popup.style.left = "0px";
  popup.style.top = "0px";

  popup.innerHTML = `
    <div class="room-popup__title">${room.label}</div>
    <div class="room-popup__actions">
      <button type="button" class="room-popup__btn room-popup__btn--start">${isStart ? "Отмена" : "Отсюда"}</button>
      <button type="button" class="room-popup__btn room-popup__btn--dest">${isDest ? "Отмена" : "Сюда"}</button>
    </div>
  `;

  popup.querySelector(".room-popup__btn--start").addEventListener("click", (e) => {
    e.stopPropagation();
    if (isStart) clearStart();
    else setStart(room.id);
    closePopup();
  });

  popup.querySelector(".room-popup__btn--dest").addEventListener("click", (e) => {
    e.stopPropagation();
    if (isDest) clearDest();
    else setDest(room.id);
    closePopup();
  });

  // на body, а не на mapStage — попап не обрезается контейнером карты
  document.body.appendChild(popup);
  positionPopup(popup, roomRect);

  activePopup = popup;
}


/* ===================================================================
 * 10. ВЫБОР СТАРТА/ФИНИША
 * ===================================================================
 * Клик по карте и поля ввода пишут в одни и те же selStart/selDest
 * и синхронизируются через onSelectionChanged.
 */

function setStart(roomId, floor = currentFloor) {
  if (selDest && selDest.floor === floor && selDest.roomId === roomId) {
    selDest = null;
  }
  selStart = { floor, roomId };
  onSelectionChanged();
}

function setDest(roomId, floor = currentFloor) {
  if (selStart && selStart.floor === floor && selStart.roomId === roomId) {
    selStart = null;
  }
  selDest = { floor, roomId };
  onSelectionChanged();
}

function clearStart() {
  selStart = null;
  onSelectionChanged();
}

function clearDest() {
  selDest = null;
  onSelectionChanged();
}

function clearSelection() {
  selStart = null;
  selDest = null;
  closePopup();
  onSelectionChanged();
}

// Любое изменение выбора: обновить подсветку, поля ввода и сбросить
// уже построенный маршрут (он относился к старому выбору).
function onSelectionChanged() {
  applyHighlight();
  syncInputsWithState();
  clearBuiltRoute();
}


/* ===================================================================
 * 11. ПАНЕЛЬ МАРШРУТА
 * =================================================================== */

// Показывает текущий шаг: при необходимости переключает этаж.
function renderRouteStep() {
  if (!routeSegments) return;
  const seg = routeSegments[routeStepIndex];

  if (currentFloor !== seg.floor) {
    setActiveFloorButton(seg.floor);
    renderFloor(seg.floor); // сам дорисует этот шаг (см. конец renderFloor)
  } else {
    drawRoutePolyline(seg.points);
  }

  updateRouteControls();
}

function clearBuiltRoute() {
  routeSegments = null;
  routeStepIndex = 0;
  clearRoutePolyline();
  updateRouteControls();
}

function updateRouteControls() {
  if (!routeControls) return;

  if (!routeSegments) {
    routeControls.style.display = "none";
    updateFinishButtonState();
    return;
  }

  const total = routeSegments.length;
  routeControls.style.display = "flex";
  routeStepLabel.textContent = total > 1
    ? `Шаг ${routeStepIndex + 1} из ${total} — этаж ${routeSegments[routeStepIndex].floor}`
    : `Маршрут на этаже ${routeSegments[routeStepIndex].floor}`;
  if (routeInstruction) routeInstruction.textContent = stepInstructionText(routeStepIndex);
  routePrevBtn.style.visibility = routeStepIndex > 0 ? "visible" : "hidden";
  routeNextBtn.style.visibility = routeStepIndex < total - 1 ? "visible" : "hidden";
  updateFinishButtonState();
}

// «Завершить» доступна, только когда маршрут построен И пользователь
// дошёл до его последнего шага (а не просто смотрит этажи через вкладки).
function updateFinishButtonState() {
  if (!finishRouteBtn) return;
  const canFinish = !!routeSegments && routeStepIndex === routeSegments.length - 1;
  finishRouteBtn.disabled = !canFinish;
  finishRouteBtn.classList.toggle("route-manual__btn--disabled", !canFinish);
}


/* ===================================================================
 * 12. ПОЛЯ ВВОДА «ОТКУДА / КУДА»
 * =================================================================== */

// Плоский список всех кабинетов со всех этажей, у которых есть дверь
// (то есть которые участвуют в маршрутах).
function collectAllRooms() {
  const list = [];
  allFloorNumbers().forEach((floor) => {
    window.FLOORS[floor].rooms.forEach((room) => {
      if (!getRoomDoors(room).length) return;
      list.push({ floor, id: room.id, label: room.label || room.id });
    });
  });
  return list;
}

// Текст в поле: «<номер> — этаж N». Этаж нужен, чтобы отличать одинаковые
// подписи/id на разных этажах.
function roomDisplayText(r) {
  return `${r.label} — этаж ${r.floor}`;
}

// Заполняет подсказки (<datalist>) и вешает обработчики на оба поля.
function populateRoomInputs() {
  if (!startInput || !destInput) return;

  const rooms = collectAllRooms();
  roomsByDisplay = new Map(rooms.map((r) => [roomDisplayText(r), r]));

  [startDatalist, destDatalist].forEach((list) => {
    if (!list) return;
    list.innerHTML = "";
    rooms.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = roomDisplayText(r);
      list.appendChild(opt);
    });
  });

  bindRoomInput(startInput, () => selStart, setStart, clearStart);
  bindRoomInput(destInput, () => selDest, setDest, clearDest);
}

// "input" срабатывает на каждую клавишу и на выбор подсказки: как только
// текст ТОЧНО совпал с кабинетом — выбор принимается; пока не совпал —
// поле подсвечивается (.is-invalid); пустое поле сбрасывает выбор.
function bindRoomInput(input, getSelection, setSelection, clearSelectionFn) {
  input.addEventListener("input", () => {
    const text = input.value.trim();
    const match = roomsByDisplay.get(text);
    input.classList.toggle("is-invalid", text !== "" && !match);

    if (match) {
      setSelection(match.id, match.floor);
    } else if (text === "" && getSelection()) {
      clearSelectionFn();
    }
  });
}

// Переписывает поля ввода по текущему выбору (после клика по карте и т.п.).
function syncInputsWithState() {
  [[startInput, selStart], [destInput, selDest]].forEach(([input, sel]) => {
    if (!input) return;
    const room = sel && findRoom(sel.floor, sel.roomId);
    input.value = room ? roomDisplayText({ floor: sel.floor, label: room.label || room.id }) : "";
    input.classList.remove("is-invalid");
  });
}


/* ===================================================================
 * 13. ОБРАБОТЧИКИ СОБЫТИЙ И ЗАПУСК
 * =================================================================== */

// Клик мимо кабинета и попапа закрывает попап.
document.addEventListener("click", (e) => {
  if (!activePopup) return;
  if (e.target.closest(".room-popup") || e.target.closest(".room-group")) return;
  closePopup();
});

// Вкладки этажей. Ручной переход НЕ сбрасывает построенный маршрут: если
// у выбранного этажа есть свой шаг — переключаемся на него; если нет —
// маршрут остаётся, просто на этом этаже линия не рисуется.
floorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const floorNum = Number(btn.dataset.floor);
    setActiveFloorButton(floorNum);

    if (routeSegments) {
      const idx = routeSegments.findIndex((s) => s.floor === floorNum);
      if (idx !== -1) routeStepIndex = idx;
    }

    renderFloor(floorNum);
    updateRouteControls();
  });
});

buildRouteBtn?.addEventListener("click", () => {
  if (!selectionIsComplete()) {
    alert("Сначала выберите и начальную, и конечную точку.");
    return;
  }
  buildFullRoute();
});

routeNextBtn?.addEventListener("click", () => {
  if (routeSegments && routeStepIndex < routeSegments.length - 1) {
    routeStepIndex++;
    renderRouteStep();
  }
});

routePrevBtn?.addEventListener("click", () => {
  if (routeSegments && routeStepIndex > 0) {
    routeStepIndex--;
    renderRouteStep();
  }
});

clearSelectionBtn?.addEventListener("click", clearSelection);

// «Завершить» — переход на экран прибытия, только когда маршрут пройден
// до последнего шага (кнопка изначально может быть не disabled, поэтому
// условие проверяем и на клике).
finishRouteBtn?.addEventListener("click", () => {
  if (!routeSegments || routeStepIndex !== routeSegments.length - 1) return;
  window.location.href = "finish.html";
});

// ---- Запуск ----
populateRoomInputs();
renderFloor(1);
updateFinishButtonState();