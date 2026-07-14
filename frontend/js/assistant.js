"use strict";

const NOVI = {
    messages: [
        "Здравствуйте! Я Novi 👋",
        "Я помогу вам найти нужное место.",
        "Выберите пункт назначения на карте."
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    // === index.html ===
    const noviButton = document.getElementById("noviButton");
    const assistantWindow = document.getElementById("assistantWindow");
    const closeAssistant = document.getElementById("closeAssistant");
    const dialog = document.getElementById("dialog");

    if (noviButton && assistantWindow) {
        noviButton.onclick = () => assistantWindow.classList.remove("hidden");
        closeAssistant.onclick = () => assistantWindow.classList.add("hidden");
    }

    // === map.html ===
    const assistantNav = document.getElementById("assistantNav");
    const noviMapText = document.getElementById("noviMapText");
    const bookAnimation = document.querySelector(".book-animation");

    if (assistantNav && noviMapText) {
        assistantNav.onclick = () => {
            const section = document.querySelector(".novi-map-assistant");
            if (section) section.scrollIntoView({ behavior: "smooth" });
            updateNoviMessage("Я готов помочь! Следуйте инструкции.");
        };
    }

    // Анимация книги
    if (bookAnimation) {
        setInterval(() => bookAnimation.classList.toggle("book-wave"), 3000);
    }

    // Приветствие
    if (noviMapText) {
        setTimeout(() => updateNoviMessage("Я построю маршрут. Следуйте шагам."), 800);
    }
});

function updateNoviMessage(text) {
    const el = document.getElementById("noviMapText");
    const dialog = document.getElementById("dialog");
    if (el) {
        el.classList.add("message-hide");
        setTimeout(() => {
            el.textContent = text;
            el.classList.remove("message-hide");
        }, 200);
    }
    if (dialog) {
        dialog.innerHTML = `<p>${text}</p>`;
    }
}

window.updateNoviMessage = updateNoviMessage;
console.log("Novi assistant ready");