"use strict";

document.addEventListener("DOMContentLoaded", () => {
    console.log("MMU NOVI app started");

    // Кнопка "Назад"
    const back = document.getElementById("backButton");
    if (back) back.onclick = () => window.history.back();

    // Нижняя навигация
    const homeNav = document.getElementById("homeNav");
    if (homeNav) homeNav.onclick = () => window.location.href = "index.html";

    // Скрыть лоадер на map.html
    const loader = document.getElementById("mapLoader");
    if (loader) {
        setTimeout(() => loader.classList.add("hidden"), 1000);
    }

    // Анимация появления glass-блоков
    document.querySelectorAll(".glass").forEach((el, i) => {
        el.style.animationDelay = (i * 0.08) + "s";
    });
});