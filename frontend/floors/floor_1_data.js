/**
 * Данные 1 этажа. Координаты в системе viewBox="0 0 1000 700"
 * (одна и та же система для всех этажей).
 *
 * rooms:
 *   shape: "rect" -> x, y, w, h
 *   shape: "path" -> d (для нестандартных форм вроде атриума)
 *
 * corridor: граф опорных точек вдоль коридора — под будущую линию маршрута,
 * не связан с формой кабинетов.
 */

window.FLOORS = window.FLOORS || {};

// Общий шрифт для ВСЕХ подписей на карте (на всех этажах) — меняешь тут,
// применяется сразу везде. Если оставить пустым/удалить — используется
// обычный шрифт страницы.
window.MAP_FONT = "'Space Grotesk', sans-serif";

window.SHOW_GRAPH_POINTS = false;

window.GRAPH_POINT_RADIUS = 5;        // радиус точек в px (и коридора, и дверей)
window.GRAPH_POINT_COLOR = "#ff9900"; // цвет точек коридора
window.GRAPH_DOOR_COLOR = "#00ff11";  // цвет точек-дверей кабинетов
window.ROUTE_COLOR = "#e23626"; // цвет линии построенного маршрута (Дейкстра)

window.ROUTE_ANIM_SPEED = 400;

window.FLOORS[1] = {

  rooms: [
    { id: "ELEV_1", label: "Лифт 1", shape: "slant-top", labelRotate: -90, x: 60, y: 0, w: 60, h: 120, door: { x: 90, y: 120 } },
    { id: "ELEV_2", label: "Лифт 2", shape: "rect", x: 1070, y: 105, w: 90, h: 50, door: { x: 1160, y: 130 } },
    { id: "ELEV_3", label: "Лифт 3", shape: "rect", x: 380, y: 450, w: 90, h: 50, door: { x: 380, y: 475 } },
    { id: "ELEV_4", label: "Лифт 4", shape: "rect", x: 780, y: 450, w: 90, h: 50, door: { x: 870, y: 475 } },
    
    { id: "STAIR_1", label: "1", type: "stairs", shape: "slant-top", x: 0, y: 0, w: 60, h: 120, door: { x: 30, y: 120 } },
    { id: "STAIR_2", label: "2", type: "stairs", shape: "rect", x: 570, y: 15, w: 110, h: 50 },
    { id: "STAIR_3", label: "3", type: "stairs", shape: "rect", x: 570, y: 135, w: 110, h: 50, doors: [{ x: 580, y: 185 }, { x: 670, y: 185 }] },
    { id: "STAIR_4", label: "4", type: "stairs", shape: "rect", x: 1190, y: 105, w: 60, h: 85, door: { x: 1190, y: 170 } },
    { id: "STAIR_5", label: "5", type: "stairs", shape: "rect", x: 380, y: 550, w: 90, h: 110, door: { x: 425, y: 550 } },
    { id: "STAIR_6", label: "6", type: "stairs", shape: "rect", x: 780, y: 550, w: 90, h: 110, door: { x: 825, y: 550 } },
    { id: "STAIR_7", label: "7", type: "stairs", shape: "rect", x: 380, y: 410, w: 90, h: 40, door: { x: 380, y: 430 } },
    { id: "STAIR_8", label: "8", type: "stairs", shape: "rect", x: 780, y: 410, w: 90, h: 40, door: { x: 870, y: 430 } },
    { id: "STAIR_9", label: "9", type: "stairs", shape: "rect", x: 0, y: 470, w: 100, h: 80, door: { x: 100, y: 520 } },
    { id: "STAIR_10", label: "10", type: "stairs", shape: "rect", x: 1000, y: 205, w: 75, h: 40 },
    
    { id: "1", label: "116", shape: "slant-top", x: 120, y: 0, w: 100, h: 120, door: { x: 170, y: 120 } },
    { id: "2", label: "", shape: "rect", x: 220, y: 15, w: 70, h: 90, door: { x: 255, y: 105 } },
    { id: "3", label: "120", shape: "rect", x: 290, y: 15, w: 90, h: 90, door: { x: 335, y: 105 } },
    { id: "4", label: "122", shape: "rect", x: 380, y: 15, w: 90, h: 90, door: { x: 425, y: 105 } },
    { id: "5", label: "124", shape: "rect", x: 470, y: 15, w: 100, h: 90, door: { x: 520, y: 105 } },
    { id: "6", label: "Буфет", shape: "rect", x: 570, y: 65, w: 110, h: 70, through: true, doors: [{ x: 570, y: 120 }, { x: 680, y: 120 }] },
    { id: "7", label: "", shape: "rect", x: 680, y: 15, w: 45, h: 90, door: { x: 705, y: 105 } },
    { id: "8", label: "", shape: "rect", x: 725, y: 15, w: 85, h: 90, door: { x: 765, y: 105 } },
    { id: "9", label: "Ж", shape: "rect", x: 810, y: 15, w: 70, h: 90, door: { x: 845, y: 105 } },
    { id: "10", label: "М", shape: "rect", x: 880, y: 15, w: 70, h: 90, door: { x: 915, y: 105 } },
    { id: "11", label: "132", shape: "rect", x: 950, y: 15, w: 100, h: 90, door: { x: 1000, y: 105 } },
    { id: "12", label: "134", shape: "rect", x: 1050, y: 0, w: 200, h: 105, door: { x: 1065, y: 105 } },
    { id: "13", label: "106", shape: "rect", x: 50, y: 550, w: 110, h: 80, door: { x: 130, y: 550 } },
    { id: "14", label: "104", shape: "rect", x: 160, y: 550, w: 110, h: 80, door: { x: 210, y: 550 } },
    { id: "15", label: "102", shape: "rect", x: 270, y: 550, w: 110, h: 80, door: { x: 325, y: 550 } },
    { id: "16", label: "", shape: "rect", x: 470, y: 550, w: 75, h: 110, door: { x: 545, y: 630 } },
    { id: "17", label: "", shape: "rect", x: 705, y: 550, w: 75, h: 110, door: { x: 705, y: 630 } },
    { id: "18", label: "103", shape: "rect", x: 260, y: 410, w: 75, h: 90, door: { x: 295, y: 500 } },
    { id: "19", label: "105", shape: "rect", x: 160, y: 410, w: 100, h: 90, door: { x: 210, y: 500 } },
    { id: "20", label: "107", shape: "rect", x: 160, y: 300, w: 70, h: 110 },
    { id: "21", label: "107а", shape: "rect", x: 160, y: 210, w: 70, h: 90 },
    { id: "22", label: "112", shape: "rect", x: 40, y: 210, w: 120, h: 160, door: { x: 130, y: 370 } },
    { id: "23", label: "", shape: "rect", x: 40, y: 370, w: 60, h: 50, door: { x: 100, y: 395 } },
    { id: "24", label: "", shape: "rect", x: 0, y: 420, w: 100, h: 50, door: { x: 100, y: 445 } },
    { id: "25", label: "148", shape: "rect", x: 870, y: 550, w: 80, h: 80, door: { x: 910, y: 550 } },
    { id: "26", label: "146", shape: "rect", x: 950, y: 510, w: 80, h: 120, door: { x: 990, y: 510 } },
    { id: "27", label: "144", shape: "rect", x: 1030, y: 510, w: 220, h: 120, door: { x: 1100, y: 510 } },
    { id: "28", label: "113", shape: "rect", x: 1025, y: 345, w: 50, h: 65, door: { x: 1075, y: 375 } },
    { id: "29", label: "111", shape: "rect", x: 1025, y: 280, w: 50, h: 65, door: { x: 1075, y: 310 } },
    { id: "30", label: "", shape: "rect", x: 1025, y: 245, w: 50, h: 35, door: { x: 1075, y: 265 } },
    { id: "31", label: "142а", shape: "rect", x: 1160, y: 410, w: 90, h: 55, door: { x: 1160, y: 440 } },
    { id: "32", label: "138", shape: "rect", x: 1120, y: 240, w: 130, h: 170, door: { x: 1120, y: 310 } },
    { id: "33", label: "115", shape: "rect", x: 915, y: 410, w: 160, h: 65, door: { x: 1075, y: 440 } },
    { id: "34", label: "", shape: "rect", x: 1120, y: 190, w: 130, h: 50, door: { x: 1120, y: 215 } },

    {
      id: "35",
      label: "101",
      shape: "round-rect",
      x: 470, y: 250, w: 310, h: 250,
      roundSide: "top",
      roundRadius: 150, 
      door: { x: 470, y: 380 }
    },

    {
      id: "SHAFT_1",
      label: "",
      shape: "frame",
      x: 545, y: 550, w: 70, h: 60,
      borderWidth: 13
    }

  ],

  corridor: {
    nodes: [
      { id: "n1", x: 130, y: 395 },
      { id: "n2", x: 130, y: 445 },
      { id: "n3", x: 130, y: 520 },
      { id: "n4", x: 210, y: 520 },
      { id: "n5", x: 295, y: 520 },
      { id: "n6", x: 325, y: 520 },
      { id: "n7", x: 355, y: 520 },
      { id: "n8", x: 425, y: 520 },
      { id: "n9", x: 640, y: 520 },
      { id: "n10", x: 640, y: 630 },
      { id: "n11", x: 825, y: 520 },
      { id: "n12", x: 890, y: 520 },
      { id: "n13", x: 890, y: 475 },
      { id: "n14", x: 920, y: 490 },
      { id: "n15", x: 990, y: 490 },
      { id: "n16", x: 1100, y: 490 },
      { id: "n17", x: 1100, y: 440 },
      { id: "n18", x: 1100, y: 375 },
      { id: "n19", x: 1100, y: 310 },
      { id: "n20", x: 1100, y: 265 },
      { id: "n21", x: 1100, y: 215 },
      { id: "n22", x: 1100, y: 170 },
      { id: "n23", x: 1170, y: 170 },
      { id: "n24", x: 1170, y: 130 },
      { id: "n25", x: 1040, y: 170 },
      { id: "n26", x: 1040, y: 130 },
      { id: "n27", x: 1000, y: 130 },
      { id: "n28", x: 915, y: 130 },
      { id: "n29", x: 845, y: 130 },
      { id: "n30", x: 765, y: 130 },
      { id: "n31", x: 705, y: 130 },
      { id: "n32", x: 705, y: 200 },
      { id: "n33", x: 545, y: 200 },
      { id: "n34", x: 545, y: 130 },
      { id: "n35", x: 520, y: 130 },
      { id: "n36", x: 425, y: 130 },
      { id: "n37", x: 335, y: 130 },
      { id: "n38", x: 255, y: 130 },
      { id: "n39", x: 170, y: 140 },
      { id: "n40", x: 90, y: 140 },
      { id: "n41", x: 30, y: 140 },
      { id: "n42", x: 355, y: 475 },
      { id: "n43", x: 355, y: 430 },
      { id: "n44", x: 355, y: 380 },
      { id: "n45", x: 300, y: 320 },
      { id: "n46", x: 430, y: 270 },
      { id: "n47", x: 280, y: 200 },
      { id: "n48", x: 890, y: 430 },
      { id: "n49", x: 890, y: 350 },
      { id: "n50", x: 800, y: 250 },
    ],
    edges: [
      ["n1", "n2"],
      ["n2", "n3"],
      ["n3", "n4"],
      ["n4", "n5"],
      ["n5", "n6"],
      ["n6", "n7"],
      ["n7", "n8"],
      ["n8", "n9"],
      ["n9", "n10"],
      ["n9", "n11"],
      ["n11", "n12"],
      ["n12", "n13"],
      ["n13", "n14"],
      ["n12", "n14"],
      ["n14", "n15"],
      ["n15", "n16"],
      ["n16", "n17"],
      ["n17", "n18"],
      ["n18", "n19"],
      ["n19", "n20"],
      ["n20", "n21"],
      ["n21", "n22"],
      ["n22", "n23"],
      ["n23", "n24"],
      ["n22", "n25"],
      ["n25", "n26"],
      ["n26", "n27"],
      ["n27", "n28"],
      ["n28", "n29"],
      ["n29", "n30"],
      ["n30", "n31"],
      ["n31", "n32"],
      ["n30", "n32"],
      ["n32", "n33"],
      ["n33", "n34"],
      ["n34", "n35"],
      ["n35", "n36"],
      ["n36", "n37"],
      ["n37", "n38"],
      ["n38", "n39"],
      ["n39", "n40"],
      ["n40", "n41"],
      ["n33", "n36"],
      ["n33", "n39"],
      ["n7", "n42"],
      ["n42", "n43"],
      ["n43", "n44"],
      ["n44", "n45"],
      ["n45", "n47"],
      ["n44", "n46"],
      ["n46", "n33"],
      ["n47", "n39"],
      ["n47", "n38"],
      ["n47", "n37"],
      ["n46", "n36"],
      ["n46", "n35"],
      ["n13", "n48"],
      ["n48", "n49"],
      ["n49", "n50"],
      ["n32", "n50"],
      ["n30", "n50"],
      
    ]
  },

  // Группы кабинетов с общим угловым срезом сверху.
  // Формат строки: ["id1", "id2", ..., rise, run]
  // id по порядку — направление скоса (от первого к последнему).
  // rise — высота подъёма среза у ПЕРВОГО id.
  // run — горизонтальная длина ската, ФИКСИРОВАННАЯ величина (не зависит
  // от количества/ширины кабинетов в группе) — благодаря этому один и тот
  // же rise+run на разных этажах всегда даёт одинаковый угол наклона,
  // даже если кабинетов в группе разное количество.
  slants: [
    ["ELEV_1", "STAIR_1", "1", 35, 160]
  ]

};