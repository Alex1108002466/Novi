"use strict";

const ROOMS_DB = {
    "101": { floor: 1, name: "Атриум", wing: "центр", node: "ATRIUM" },
    "102": { floor: 1, name: "Главный вход", wing: "запад", node: "START" },
    "103": { floor: 1, name: "Аудитория 103", wing: "запад", node: "103" },
    "104": { floor: 1, name: "Аудитория 104", wing: "запад", node: "104" },
    "105": { floor: 1, name: "Аудитория 105", wing: "запад", node: "105" },
    "106": { floor: 1, name: "Аудитория 106", wing: "запад", node: "106" },
    "107": { floor: 1, name: "Аудитория 107", wing: "запад", node: "107" },
    "111": { floor: 1, name: "Аудитория 111", wing: "восток", node: "111" },
    "112": { floor: 1, name: "Аудитория 112", wing: "запад", node: "112" },
    "115": { floor: 1, name: "Библиотека", wing: "восток", node: "115" },
    "116": { floor: 1, name: "Типография", wing: "север", node: "116" },
    "117": { floor: 1, name: "Аудитория 117", wing: "север", node: "117" },
    "121": { floor: 1, name: "Аудитория 121", wing: "север", node: "121" },
    "122": { floor: 1, name: "Аудитория 122", wing: "север", node: "122" },
    "123": { floor: 1, name: "Аудитория 123", wing: "север", node: "123" },
    "132": { floor: 1, name: "Тренажёрный зал", wing: "восток", node: "132" },
    "134": { floor: 1, name: "Аудитория 134", wing: "восток", node: "134" },
    "138": { floor: 1, name: "Аудитория 138", wing: "восток", node: "138" },
    "139": { floor: 1, name: "Преподавательская", wing: "восток", node: "139" },
    "142": { floor: 1, name: "Аудитория 142", wing: "восток", node: "142" },
    "144": { floor: 1, name: "Столовая", wing: "юг", node: "144" },
    "145": { floor: 1, name: "Аудитория 145", wing: "юг", node: "145" },
    "146": { floor: 1, name: "Аудитория 146", wing: "юг", node: "146" },
    "148": { floor: 1, name: "Аудитория 148", wing: "юг", node: "148" },
    "201": { floor: 2, name: "Малый актовый зал", wing: "центр", node: "201" },
    "202": { floor: 2, name: "Аудитория 202", wing: "запад", node: "202" },
    "204": { floor: 2, name: "Аудитория 204", wing: "запад", node: "204" },
    "205": { floor: 2, name: "Аудитория 205", wing: "запад", node: "205" },
    "206": { floor: 2, name: "Аудитория 206", wing: "запад", node: "206" },
    "208": { floor: 2, name: "Компьютерные классы", wing: "запад", node: "208" },
    "210": { floor: 2, name: "Аудитория 210", wing: "запад", node: "210" },
    "212": { floor: 2, name: "Аудитория 212", wing: "запад", node: "212" },
    "219": { floor: 2, name: "Аудитория 219", wing: "запад", node: "219" },
    "220": { floor: 2, name: "Аудитория 220", wing: "север", node: "220" },
    "221": { floor: 2, name: "Аудитория 221", wing: "север", node: "221" },
    "226": { floor: 2, name: "Аудитория 226", wing: "север", node: "226" },
    "230": { floor: 2, name: "Аудитория 230", wing: "север", node: "230" },
    "232": { floor: 2, name: "Аудитория 232", wing: "север", node: "232" },
    "234": { floor: 2, name: "Аудитория 234", wing: "север", node: "234" },
    "235": { floor: 2, name: "Аудитория 235", wing: "север", node: "235" },
    "240": { floor: 2, name: "Аудитория 240", wing: "восток", node: "240" },
    "244": { floor: 2, name: "Аудитория 244", wing: "восток", node: "244" },
    "246": { floor: 2, name: "Аудитория 246", wing: "восток", node: "246" },
    "250": { floor: 2, name: "Аудитория 250", wing: "восток", node: "250" },
    "252": { floor: 2, name: "Аудитория 252", wing: "восток", node: "252" },
    "256": { floor: 2, name: "Аудитория 256", wing: "юг", node: "256" },
    "258": { floor: 2, name: "Аудитория 258", wing: "юг", node: "258" },
    "260": { floor: 2, name: "Аудитория 260", wing: "юг", node: "260" },
    "300": { floor: 3, name: "Единый деканат", wing: "центр", node: "DEAN" },
    "302": { floor: 3, name: "Аудитория 302", wing: "юг", node: "302" },
    "304": { floor: 3, name: "Аудитория 304", wing: "юг", node: "304" },
    "306": { floor: 3, name: "Аудитория 306", wing: "юг", node: "306" },
    "308": { floor: 3, name: "Аудитория 308", wing: "запад", node: "308" },
    "310": { floor: 3, name: "Аудитория 310", wing: "запад", node: "310" },
    "312": { floor: 3, name: "Аудитория 312", wing: "запад", node: "312" },
    "316": { floor: 3, name: "МШНК", wing: "север", node: "316" },
    "329": { floor: 3, name: "Аудитория 329", wing: "юг", node: "329" },
    "330": { floor: 3, name: "Аудитория 330", wing: "север", node: "330" },
    "332": { floor: 3, name: "Аудитория 332", wing: "север", node: "332" },
    "334": { floor: 3, name: "Аудитория 334", wing: "север", node: "334" },
    "336": { floor: 3, name: "Аудитория 336", wing: "север", node: "336" },
    "343": { floor: 3, name: "Аудитория 343", wing: "восток", node: "343" },
    "345": { floor: 3, name: "Аудитория 345", wing: "север", node: "345" },
    "346": { floor: 3, name: "Аудитория 346", wing: "восток", node: "346" },
    "348": { floor: 3, name: "Аудитория 348", wing: "восток", node: "348" },
    "350": { floor: 3, name: "Аудитория 350", wing: "восток", node: "350" },
    "356": { floor: 3, name: "Аудитория 356", wing: "восток", node: "356" },
    "358": { floor: 3, name: "Аудитория 358", wing: "юг", node: "358" },
    "360": { floor: 3, name: "Аудитория 360", wing: "восток", node: "360" },
    "362": { floor: 3, name: "Аудитория 362", wing: "юг", node: "362" },
    "364": { floor: 3, name: "Аудитория 364", wing: "юг", node: "364" },
    "400": { floor: 4, name: "Большой актовый зал", wing: "центр", node: "400" },
    "415": { floor: 4, name: "Ректор", wing: "восток", node: "RECTOR" },
    "417": { floor: 4, name: "Пред. управ. совета", wing: "юг", node: "417" },
    "420": { floor: 4, name: "Аудитория 420", wing: "север", node: "420" },
    "422": { floor: 4, name: "Бухгалтерия", wing: "восток", node: "422" },
    "426": { floor: 4, name: "Военно-учётный стол", wing: "восток", node: "426" },
    "430": { floor: 4, name: "Аудитория 430", wing: "восток", node: "430" },
    "432": { floor: 4, name: "Аудитория 432", wing: "юг", node: "432" },
    "434": { floor: 4, name: "Аудитория 434", wing: "юг", node: "434" },
    "501": { floor: 5, name: "Аудитория 501", wing: "запад", node: "501" },
    "502": { floor: 5, name: "Лицей", wing: "запад", node: "LYC" },
    "505": { floor: 5, name: "Аудитория 505", wing: "север", node: "505" },
    "506": { floor: 5, name: "Аудитория 506", wing: "запад", node: "506" },
    "507": { floor: 5, name: "Аудитория 507", wing: "север", node: "507" },
    "512": { floor: 5, name: "Аудитория 512", wing: "север", node: "512" },
    "514": { floor: 5, name: "Аудитория 514", wing: "север", node: "514" },
    "515": { floor: 5, name: "Аудитория 515", wing: "восток", node: "515" },
    "516": { floor: 5, name: "Аудитория 516", wing: "север", node: "516" },
    "517": { floor: 5, name: "Мед. кабинет", wing: "восток", node: "MED" },
    "518": { floor: 5, name: "Аудитория 518", wing: "север", node: "518" },
    "520": { floor: 5, name: "Аудитория 520", wing: "север", node: "520" },
    "522": { floor: 5, name: "Аудитория 522", wing: "восток", node: "522" },
    "526": { floor: 5, name: "Аудитория 526", wing: "восток", node: "526" },
    "530": { floor: 5, name: "Аудитория 530", wing: "восток", node: "530" },
    "532": { floor: 5, name: "Аудитория 532", wing: "восток", node: "532" },
    "534": { floor: 5, name: "Аудитория 534", wing: "юг", node: "534" },
    "538": { floor: 5, name: "Аудитория 538", wing: "юг", node: "538" },
    "601": { floor: 6, name: "Аудитория 601", wing: "запад", node: "601" },
    "602": { floor: 6, name: "Аудитория 602", wing: "север", node: "602" },
    "603": { floor: 6, name: "Аудитория 603", wing: "север", node: "603" },
    "606": { floor: 6, name: "Аудитория 606", wing: "запад", node: "606" },
    "607": { floor: 6, name: "Аудитория 607", wing: "запад", node: "607" },
    "610": { floor: 6, name: "Аудитория 610", wing: "восток", node: "610" },
    "611": { floor: 6, name: "Аудитория 611", wing: "восток", node: "611" },
    "612": { floor: 6, name: "Аудитория 612", wing: "восток", node: "612" },
    "613": { floor: 6, name: "Аудитория 613", wing: "восток", node: "613" },
    "616": { floor: 6, name: "Аудитория 616", wing: "восток", node: "616" },
    "617": { floor: 6, name: "Аудитория 617", wing: "восток", node: "617" },
    "618": { floor: 6, name: "Аудитория 618", wing: "восток", node: "618" }
};

const FLOOR_NAMES = { 1: "1 этаж", 2: "2 этаж", 3: "3 этаж", 4: "4 этаж", 5: "5 этаж", 6: "6 этаж" };
const WING_NAMES = { 
    "запад": "западное крыло", 
    "восток": "восточное крыло", 
    "север": "северное крыло", 
    "юг": "южное крыло", 
    "центр": "центр" 
};

let currentSearchRoom = null;

function openSearchModal() {
    document.getElementById("searchModal").classList.remove("hidden");
}

function closeSearchModal() {
    document.getElementById("searchModal").classList.add("hidden");
    document.getElementById("searchResult").classList.add("hidden");
    document.getElementById("roomInput").value = "";
    currentSearchRoom = null;
}

function goToMap() {
    window.location.href = "map.html?dest=rooms";
}

function searchRoom() {
    const input = document.getElementById("roomInput");
    const roomNumber = input.value.trim();
    
    if (!roomNumber) {
        input.style.borderColor = "#ef4444";
        setTimeout(() => { input.style.borderColor = ""; }, 300);
        return;
    }
    
    const room = ROOMS_DB[roomNumber];
    
    if (room) {
        currentSearchRoom = room;
        showSearchResult(roomNumber, room);
    } else {
        showNotFound(roomNumber);
    }
}

function showSearchResult(number, room) {
    const resultDiv = document.getElementById("searchResult");
    const resultName = document.getElementById("resultName");
    const resultLocation = document.getElementById("resultLocation");
    
    resultName.textContent = `Аудитория ${number}`;
    resultLocation.textContent = `${FLOOR_NAMES[room.floor]} · ${WING_NAMES[room.wing] || room.wing}`;
    
    resultDiv.classList.remove("hidden");
}

function showNotFound(number) {
    const resultDiv = document.getElementById("searchResult");
    const resultName = document.getElementById("resultName");
    const resultLocation = document.getElementById("resultLocation");
    
    resultName.textContent = `Аудитория ${number} не найдена`;
    resultLocation.textContent = "Проверьте номер или выберите из частого поиска";
    resultLocation.style.color = "#ef4444";
    
    resultDiv.classList.remove("hidden");
    setTimeout(() => { resultLocation.style.color = ""; }, 3000);
}

function quickSearch(roomNumber) {
    document.getElementById("roomInput").value = roomNumber;
    searchRoom();
}

function buildRouteToRoom() {
    if (currentSearchRoom) {
        const roomNumber = document.getElementById("roomInput").value.trim();
        window.location.href = `map.html?dest=rooms&room=${roomNumber}&node=${currentSearchRoom.node}&floor=${currentSearchRoom.floor}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("roomInput");
    if (input) {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") searchRoom();
        });
    }
});