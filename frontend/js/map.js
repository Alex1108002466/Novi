/**
 * Движок карты этажей. Не завязан на конкретные данные — просто
 * читает FLOOR_DATA (см. map-data.js) и рисует то, что там описано.
 *
 * Логика маршрута — упрощённая (не настоящий граф/Дейкстра, как на
 * бэкенде): линия строится в 4 точки — центр старта -> точка выхода
 * старта к холлу -> точка входа холла к финишу -> центр финиша.
 * Для схематичной мобильной карты этого достаточно, чтобы стрелка
 * выглядела так, будто идёт "через коридор", а не сквозь стены.
 * Когда будет реальный бэкенд-граф (см. API_DOCS.md, /route) — эту
 * функцию несложно заменить на отрисовку пришедшего с сервера path.
 */

let currentFloor = 1;
let startRoom = null;
let destRoom = null;

const mapGrid = document.getElementById("mapGrid");
const routeSvg = document.getElementById("routeSvg");
const floorTitle = document.getElementById("floorTitle");
const selectionBar = document.getElementById("selectionBar");
const selectionText = document.getElementById("selectionText");
const routeStats = document.getElementById("routeStats");
const arriveBtn = document.getElementById("arriveBtn");

function roomTypeClass(type) {
  return type ? `room--${type}` : "room--room";
}

function makeRoomEl(room) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = `room ${roomTypeClass(room.type)}`;
  el.dataset.id = room.id;
  el.innerHTML = `
    <span class="room__label">${room.label}</span>
    ${room.sub ? `<span class="room__sub">${room.sub}</span>` : ""}
  `;
  el.addEventListener("click", () => onRoomClick(room, el));
  return el;
}

function renderRing(floor) {
  const cols = Math.max(floor.top.length, floor.bottom.length);
  const midRows = Math.max(floor.left.length, floor.right.length);
  const totalRows = midRows + 2;

  mapGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(84px, 1fr))`;
  mapGrid.style.gridTemplateRows = `repeat(${totalRows}, 64px)`;
  mapGrid.classList.remove("map-grid--clusters");

  floor.top.forEach((room, i) => {
    const el = makeRoomEl(room);
    el.style.gridColumn = i + 1;
    el.style.gridRow = 1;
    mapGrid.appendChild(el);
  });

  floor.bottom.forEach((room, i) => {
    const el = makeRoomEl(room);
    el.style.gridColumn = i + 1;
    el.style.gridRow = totalRows;
    mapGrid.appendChild(el);
  });

  floor.left.forEach((room, i) => {
    const el = makeRoomEl(room);
    el.style.gridColumn = 1;
    el.style.gridRow = i + 2;
    mapGrid.appendChild(el);
  });

  floor.right.forEach((room, i) => {
    const el = makeRoomEl(room);
    el.style.gridColumn = cols;
    el.style.gridRow = i + 2;
    mapGrid.appendChild(el);
  });

  const hallEl = makeRoomEl({ ...floor.hall, type: "hall" });
  hallEl.style.gridColumn = `2 / ${cols}`;
  hallEl.style.gridRow = `2 / ${totalRows}`;
  mapGrid.appendChild(hallEl);
}

function renderClusters(floor) {
  mapGrid.style.gridTemplateColumns = "1fr";
  mapGrid.style.gridTemplateRows = "auto";
  mapGrid.classList.add("map-grid--clusters");

  floor.clusters.forEach((cluster) => {
    const wrap = document.createElement("div");
    wrap.className = "cluster";
    wrap.innerHTML = `<div class="cluster__label">${cluster.label}</div>`;
    const inner = document.createElement("div");
    inner.className = "cluster__rooms";
    cluster.rooms.forEach((room) => inner.appendChild(makeRoomEl(room)));
    wrap.appendChild(inner);
    mapGrid.appendChild(wrap);
  });
}

function renderFloor(floorNumber) {
  currentFloor = floorNumber;
  startRoom = null;
  destRoom = null;
  mapGrid.innerHTML = "";
  clearRouteLine();
  updateSelectionBar();

  const floor = FLOOR_DATA[floorNumber];
  floorTitle.textContent = floor.title;

  document.querySelectorAll(".floor-pill").forEach((btn) => {
    btn.classList.toggle("floor-pill--active", Number(btn.dataset.floor) === floorNumber);
  });

  if (floor.layout === "ring") {
    renderRing(floor);
  } else {
    renderClusters(floor);
  }
}

function onRoomClick(room, el) {
  if (room.type === "hall") return; // холл сам по себе не выбираем как точку

  if (!startRoom) {
    startRoom = { room, el };
    el.classList.add("room--start");
  } else if (!destRoom && room.id !== startRoom.room.id) {
    destRoom = { room, el };
    el.classList.add("room--dest");
    drawRoute();
  } else {
    // третий клик — сброс и новый старт
    resetSelection();
    startRoom = { room, el };
    el.classList.add("room--start");
  }

  updateSelectionBar();
}

function resetSelection() {
  document.querySelectorAll(".room--start, .room--dest").forEach((el) => {
    el.classList.remove("room--start", "room--dest");
  });
  startRoom = null;
  destRoom = null;
  clearRouteLine();
}

function updateSelectionBar() {
  if (!startRoom) {
    selectionBar.classList.add("selection-bar--hidden");
    arriveBtn.classList.add("selection-bar__arrive--hidden");
    return;
  }
  selectionBar.classList.remove("selection-bar--hidden");
  if (!destRoom) {
    selectionText.textContent = `Откуда: ${startRoom.room.label} · выбери, куда идём`;
    routeStats.textContent = "";
    arriveBtn.classList.add("selection-bar__arrive--hidden");
  } else {
    selectionText.textContent = `${startRoom.room.label} → ${destRoom.room.label}`;
    arriveBtn.classList.remove("selection-bar__arrive--hidden");
  }
}

function clearRouteLine() {
  routeSvg.innerHTML = "";
  routeStats.textContent = "";
}

/* ---------- Построение маршрута (упрощённое, см. комментарий вверху) ---------- */

function centerOf(el, containerRect) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 - containerRect.left,
    y: r.top + r.height / 2 - containerRect.top,
  };
}

// точка на границе прямоугольника room в направлении target
function edgePointTowards(el, target, containerRect) {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2 - containerRect.left;
  const cy = r.top + r.height / 2 - containerRect.top;
  const dx = target.x - cx;
  const dy = target.y - cy;
  const halfW = r.width / 2;
  const halfH = r.height / 2;
  const scale = Math.min(
    dx !== 0 ? Math.abs(halfW / dx) : Infinity,
    dy !== 0 ? Math.abs(halfH / dy) : Infinity
  );
  return { x: cx + dx * scale, y: cy + dy * scale };
}

function drawRoute() {
  const containerRect = mapGrid.getBoundingClientRect();
  routeSvg.setAttribute("width", containerRect.width);
  routeSvg.setAttribute("height", containerRect.height);
  routeSvg.setAttribute("viewBox", `0 0 ${containerRect.width} ${containerRect.height}`);

  const hallEl = mapGrid.querySelector(".room--hall") || mapGrid; // для кластеров — весь контейнер
  const startCenter = centerOf(startRoom.el, containerRect);
  const destCenter = centerOf(destRoom.el, containerRect);
  const hallCenter = centerOf(hallEl, containerRect);

  const startDoor = edgePointTowards(startRoom.el, hallCenter, containerRect);
  const destDoor = edgePointTowards(destRoom.el, hallCenter, containerRect);

  const points = [startCenter, startDoor, hallCenter, destDoor, destCenter];
  const pathStr = points.map((p) => `${p.x},${p.y}`).join(" ");

  routeSvg.innerHTML = `
    <polyline points="${pathStr}" class="route-path" />
    <circle cx="${startCenter.x}" cy="${startCenter.y}" r="6" class="route-dot route-dot--start" />
    <circle cx="${destCenter.x}" cy="${destCenter.y}" r="6" class="route-dot route-dot--dest" />
  `;

  // условная оценка расстояния/времени — по длине линии в px, не по метрам
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  const meters = Math.round(length / 4); // грубый коэффициент, пока нет реальных данных
  const minutes = Math.max(1, Math.round(meters / 60));
  routeStats.textContent = `≈ ${meters} м · ≈ ${minutes} мин`;
}

/* ---------- Инициализация ---------- */

document.querySelectorAll(".floor-pill").forEach((btn) => {
  btn.addEventListener("click", () => renderFloor(Number(btn.dataset.floor)));
});

document.getElementById("clearSelectionBtn").addEventListener("click", resetSelection);

window.addEventListener("resize", () => {
  if (startRoom && destRoom) drawRoute();
});

renderFloor(1);