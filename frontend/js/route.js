"use strict";

const PLACES = {
    admission: "Приёмная комиссия",
    dean: "Деканат",
    wc: "Санузлы",
    library: "Библиотека",
    cafe: "Столовая",
    atrium: "Атриум",
    pc: "Компьютерные классы",
    rector: "Ректор",
    med: "Мед. кабинет",
    rooms: "Аудитории"
};

const PLACE_ICONS = {
    admission: "📋", dean: "🏢", wc: "", library: "📚",
    cafe: "🍽️", atrium: "🏛️", pc: "💻", rector: "👔", med: "", rooms: ""
};

const FLOOR_NAMES = { 1: "1 этаж", 2: "2 этаж", 3: "3 этаж", 4: "4 этаж", 5: "5 этаж", 6: "6 этаж" };

/* ВСТРОЕННЫЕ SVG КАРТЫ */
const FLOOR_SVGS = {
           1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 1000" width="100%" height="100%">
  <defs>
    <style>
      .bg { fill: #f4f7fa; }
      .corridor { fill: #e8edf2; stroke: #c5cdd6; stroke-width: 1.5; }
      .room { fill: #ffffff; stroke: #a8b4c0; stroke-width: 1.5; cursor: pointer; transition: fill 0.2s, stroke 0.2s; }
      .room:hover { fill: #dce4ec; stroke: #6b7d8f; }
      .room-special { fill: #d4dde6; stroke: #a8b4c0; stroke-width: 1.5; cursor: pointer; transition: fill 0.2s; }
      .room-special:hover { fill: #b8c6d4; }
      .wall { fill: none; stroke: #2a3a4a; stroke-width: 4; stroke-linejoin: round; }
      .label { fill: #2a3a4a; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-anchor: middle; pointer-events: none; }
      .label-small { fill: #2a3a4a; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; text-anchor: middle; pointer-events: none; }
      .label-title { fill: #2a3a4a; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; }
      .icon { font-size: 20px; pointer-events: none; }
      .stair-icon { font-size: 22px; pointer-events: none; }
    </style>
  </defs>

  <!-- Фон -->
  <rect class="bg" width="1400" height="1000"/>

  <!-- ==================== ОСНОВНОЙ КОНТУР ЭТАЖА (коридор/атриум) ==================== -->
  <!-- Форма этажа: закруглённый левый край, прямоугольное тело, выступ вестибюля справа -->
  <path class="corridor" d="
    M 200,60
    L 1200,60
    L 1200,260
    L 1320,260
    L 1320,360
    L 1260,360
    L 1260,420
    L 1320,420
    L 1320,520
    L 1260,520
    L 1260,580
    L 1320,580
    L 1320,680
    L 1200,680
    L 1200,940
    L 200,940
    A 440,440 0 0,1 200,60
    Z"/>

  <!-- ==================== ВЕРХНЯЯ ЧАСТЬ (северная стена) ==================== -->

  <!-- 138 Преподавательская -->
  <g class="room-group" data-room="138">
    <rect class="room" x="420" y="75" width="320" height="130" onclick="selectRoom('138')"/>
    <text class="label-title" x="580" y="130">ПРЕПОДАВА-</text>
    <text class="label-title" x="580" y="148">ТЕЛЬСКАЯ</text>
    <text class="label" x="580" y="175">138</text>
  </g>

  <!-- 142 -->
  <g class="room-group" data-room="142">
    <rect class="room" x="750" y="75" width="60" height="60" onclick="selectRoom('142')"/>
    <text class="label" x="780" y="110">142</text>
  </g>

  <!-- 140 -->
  <g class="room-group" data-room="140">
    <rect class="room" x="750" y="140" width="60" height="60" onclick="selectRoom('140')"/>
    <text class="label" x="780" y="175">140</text>
  </g>

  <!-- 111 -->
  <g class="room-group" data-room="111">
    <rect class="room" x="560" y="215" width="60" height="40" onclick="selectRoom('111')"/>
    <text class="label-small" x="590" y="240">111</text>
  </g>

  <!-- 113 -->
  <g class="room-group" data-room="113">
    <rect class="room" x="630" y="215" width="60" height="40" onclick="selectRoom('113')"/>
    <text class="label-small" x="660" y="240">113</text>
  </g>

  <!-- 115 -->
  <g class="room-group" data-room="115">
    <rect class="room" x="750" y="215" width="80" height="80" onclick="selectRoom('115')"/>
    <text class="label" x="790" y="260">115</text>
  </g>

  <!-- 144 Столовая -->
  <g class="room-group" data-room="144">
    <rect class="room" x="850" y="75" width="340" height="180" onclick="selectRoom('144')"/>
    <text class="label-title" x="1020" y="155">СТОЛОВАЯ</text>
    <text class="label" x="1020" y="180">144</text>
  </g>

  <!-- 146 -->
  <g class="room-group" data-room="146">
    <rect class="room" x="850" y="265" width="80" height="55" onclick="selectRoom('146')"/>
    <text class="label" x="890" y="297">146</text>
  </g>

  <!-- 148 -->
  <g class="room-group" data-room="148">
    <rect class="room" x="940" y="265" width="80" height="55" onclick="selectRoom('148')"/>
    <text class="label" x="980" y="297">148</text>
  </g>

  <!-- ==================== ЛЕВАЯ ЧАСТЬ (западная стена, сверху вниз) ==================== -->

  <!-- 134 Тренажерный зал -->
  <g class="room-group" data-room="134">
    <rect class="room" x="75" y="75" width="130" height="110" onclick="selectRoom('134')"/>
    <text class="label-title" x="140" y="120">ТРЕНАЖЕРНЫЙ</text>
    <text class="label-title" x="140" y="138">ЗАЛ</text>
    <text class="label" x="140" y="160">134</text>
  </g>

  <!-- Раздевалка мужская -->
  <g class="room-group" data-room="razdev_m">
    <rect class="room" x="75" y="190" width="130" height="55" onclick="selectRoom('razdev_m')"/>
    <text class="label-title" x="140" y="213">РАЗДЕВАЛКА</text>
    <text class="label-title" x="140" y="230">МУЖСКАЯ</text>
  </g>

  <!-- WC мужской -->
  <g class="room-group" data-room="WC_M">
    <rect class="room-special" x="75" y="250" width="62" height="55" onclick="selectRoom('WC_M')"/>
    <text class="label-small" x="93" y="275">WC</text>
    <text class="icon" x="115" y="282">♂</text>
  </g>

  <!-- WC женский -->
  <g class="room-group" data-room="WC_F">
    <rect class="room-special" x="143" y="250" width="62" height="55" onclick="selectRoom('WC_F')"/>
    <text class="label-small" x="161" y="275">WC</text>
    <text class="icon" x="183" y="282">♀</text>
  </g>

  <!-- Буфет -->
  <g class="room-group" data-room="bufet">
    <rect class="room" x="75" y="310" width="130" height="55" onclick="selectRoom('bufet')"/>
    <text class="label-title" x="140" y="342">БУФЕТ</text>
  </g>

  <!-- 124 Приемная комиссия -->
  <g class="room-group" data-room="124">
    <rect class="room" x="75" y="375" width="130" height="80" onclick="selectRoom('124')"/>
    <text class="label-title" x="140" y="405">ПРИЕМНАЯ</text>
    <text class="label-title" x="140" y="422">КОМИССИЯ</text>
    <text class="label" x="140" y="442">124</text>
  </g>

  <!-- 122 Приемная комиссия -->
  <g class="room-group" data-room="122">
    <rect class="room" x="75" y="460" width="130" height="80" onclick="selectRoom('122')"/>
    <text class="label-title" x="140" y="490">ПРИЕМНАЯ</text>
    <text class="label-title" x="140" y="507">КОМИССИЯ</text>
    <text class="label" x="140" y="527">122</text>
  </g>

  <!-- 120 -->
  <g class="room-group" data-room="120">
    <rect class="room" x="75" y="545" width="130" height="80" onclick="selectRoom('120')"/>
    <text class="label" x="140" y="590">120</text>
  </g>

  <!-- Клининг-служба -->
  <g class="room-group" data-room="118">
    <rect class="room" x="75" y="630" width="130" height="90" onclick="selectRoom('118')"/>
    <text class="label-title" x="140" y="668">КЛИНИНГ-</text>
    <text class="label-title" x="140" y="685">СЛУЖБА</text>
  </g>

  <!-- 116 -->
  <g class="room-group" data-room="116">
    <rect class="room" x="75" y="725" width="130" height="130" onclick="selectRoom('116')"/>
    <text class="label" x="140" y="795">116</text>
  </g>

  <!-- ==================== ЦЕНТР (АТРИУМ) ==================== -->

  <!-- Название АТРИУМ -->
  <text class="label" x="430" y="430" font-size="22" font-weight="bold" fill="#2a3a4a" pointer-events="none">АТРИУМ</text>

  <!-- Полукруглая зона кафе (круглые столы) -->
  <path class="room" d="M 470,380 A 130,130 0 0,1 730,380 L 730,560 L 470,560 Z" onclick="selectRoom('cafe')" style="cursor:pointer"/>
  <!-- Круглые столы -->
  <circle cx="510" cy="420" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="560" cy="400" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="620" cy="395" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="680" cy="410" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="510" cy="480" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="560" cy="510" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="620" cy="525" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="680" cy="510" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>

  <!-- 101 -->
  <g class="room-group" data-room="101">
    <rect class="room" x="735" y="380" width="180" height="180" onclick="selectRoom('101')"/>
    <text class="label" x="825" y="475">101</text>
  </g>

  <!-- Столовая (маленькая, у 103) -->
  <g class="room-group" data-room="stolovaya_m">
    <rect class="room" x="735" y="570" width="100" height="55" onclick="selectRoom('stolovaya_m')"/>
    <text class="label-title" x="785" y="602">СТОЛОВАЯ</text>
  </g>

  <!-- ==================== ПРАВАЯ ЧАСТЬ (вестибюль) ==================== -->

  <!-- Центральный вестибюль -->
  <text class="label" x="1090" y="470" font-size="14" font-weight="bold" fill="#2a3a4a" pointer-events="none">ЦЕНТРАЛЬНЫЙ</text>
  <text class="label" x="1090" y="490" font-size="14" font-weight="bold" fill="#2a3a4a" pointer-events="none">ВЕСТИБЮЛЬ</text>

  <!-- Гардероб верхний -->
  <g class="room-group" data-room="garderob_1">
    <rect class="room" x="1010" y="380" width="160" height="70" onclick="selectRoom('garderob_1')"/>
    <text class="label-title" x="1090" y="420">ГАРДЕРОБ</text>
  </g>

  <!-- Гардероб нижний -->
  <g class="room-group" data-room="garderob_2">
    <rect class="room" x="1010" y="540" width="160" height="70" onclick="selectRoom('garderob_2')"/>
    <text class="label-title" x="1090" y="580">ГАРДЕРОБ</text>
  </g>

  <!-- ==================== НИЖНЯЯ ЧАСТЬ ==================== -->

  <!-- Типография 112 -->
  <g class="room-group" data-room="112">
    <rect class="room" x="370" y="720" width="200" height="200" onclick="selectRoom('112')"/>
    <text class="label-title" x="470" y="810">ТИПОГРАФИЯ</text>
    <text class="label" x="470" y="835">112</text>
  </g>

  <!-- 107А -->
  <g class="room-group" data-room="107A">
    <rect class="room" x="370" y="720" width="100" height="95" onclick="selectRoom('107A')"/>
    <text class="label" x="420" y="772">107 А</text>
  </g>

  <!-- 107 -->
  <g class="room-group" data-room="107">
    <rect class="room" x="475" y="720" width="95" height="95" onclick="selectRoom('107')"/>
    <text class="label" x="522" y="772">107</text>
  </g>

  <!-- 110 -->
  <g class="room-group" data-room="110">
    <rect class="room" x="580" y="870" width="60" height="55" onclick="selectRoom('110')"/>
    <text class="label-small" x="610" y="902">110</text>
  </g>

  <!-- WC нижний -->
  <g class="room-group" data-room="WC_110">
    <rect class="room-special" x="645" y="870" width="60" height="55" onclick="selectRoom('WC_110')"/>
    <text class="label-small" x="675" y="902">WC</text>
  </g>

  <!-- 103 -->
  <g class="room-group" data-room="103">
    <rect class="room" x="735" y="635" width="80" height="75" onclick="selectRoom('103')"/>
    <text class="label" x="775" y="677">103</text>
  </g>

  <!-- 105 -->
  <g class="room-group" data-room="105">
    <rect class="room" x="735" y="720" width="120" height="120" onclick="selectRoom('105')"/>
    <text class="label" x="795" y="785">105</text>
  </g>

  <!-- 102 -->
  <g class="room-group" data-room="102">
    <rect class="room" x="920" y="720" width="100" height="100" onclick="selectRoom('102')"/>
    <text class="label" x="970" y="775">102</text>
  </g>

  <!-- 104 -->
  <g class="room-group" data-room="104">
    <rect class="room" x="920" y="825" width="100" height="100" onclick="selectRoom('104')"/>
    <text class="label" x="970" y="880">104</text>
  </g>

  <!-- 106 -->
  <g class="room-group" data-room="106">
    <rect class="room" x="920" y="930" width="100" height="10" onclick="selectRoom('106')" style="display:none"/>
    <rect class="room" x="920" y="830" width="100" height="100" onclick="selectRoom('106')" style="display:none"/>
    <rect class="room" x="1030" y="720" width="100" height="210" onclick="selectRoom('106')"/>
    <text class="label" x="1080" y="830">106</text>
  </g>

  <!-- ==================== ЛЕСТНИЦЫ (иконки бегущего человека) ==================== -->
  <g class="stairs">
    <!-- У тренажерного зала (верхний левый угол) -->
    <text class="stair-icon" x="230" y="130" font-size="24">🏃</text>
    <!-- У буфета (левая сторона, 2 лестницы) -->
    <text class="stair-icon" x="220" y="340" font-size="24">🏃</text>
    <text class="stair-icon" x="220" y="370" font-size="24">🏃</text>
    <!-- У столовой малой -->
    <text class="stair-icon" x="840" y="600" font-size="24">🏃</text>
    <!-- В вестибюле (2 лестницы) -->
    <text class="stair-icon" x="1180" y="340" font-size="24">🏃</text>
    <text class="stair-icon" x="1180" y="640" font-size="24">🏃</text>
    <!-- У 110/WC -->
    <text class="stair-icon" x="720" y="900" font-size="24">🏃</text>
    <!-- У 116 (нижний левый угол) -->
    <text class="stair-icon" x="230" y="870" font-size="24">🏃</text>
  </g>

  <!-- ==================== ВНЕШНИЙ КОНТУР ==================== -->
  <path class="wall" d="
    M 200,60
    L 1200,60
    L 1200,260
    L 1320,260
    L 1320,360
    L 1260,360
    L 1260,420
    L 1320,420
    L 1320,520
    L 1260,520
    L 1260,580
    L 1320,580
    L 1320,680
    L 1200,680
    L 1200,940
    L 200,940
    A 440,440 0 0,1 200,60
    Z"/>

  <script type="text/javascript">
    <![CDATA[
    function selectRoom(roomId) {
      console.log('Выбран кабинет: ' + roomId);
      if (window.onRoomSelect) {
        window.onRoomSelect(roomId);
      }
      alert('Кабинет: ' + roomId);
    }
    ]]>
  </script>
</svg>`, 
    2: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 1000" width="100%" height="100%">
  <defs>
    <style>
      .bg { fill: #f4f7fa; }
      .corridor { fill: #e8edf2; stroke: #c5cdd6; stroke-width: 1.5; }
      .room { fill: #ffffff; stroke: #a8b4c0; stroke-width: 1.5; cursor: pointer; transition: fill 0.2s, stroke 0.2s; }
      .room:hover { fill: #dce4ec; stroke: #6b7d8f; }
      .room-special { fill: #d4dde6; stroke: #a8b4c0; stroke-width: 1.5; cursor: pointer; transition: fill 0.2s; }
      .room-special:hover { fill: #b8c6d4; }
      .wall { fill: none; stroke: #2a3a4a; stroke-width: 4; stroke-linejoin: round; }
      .label { fill: #2a3a4a; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-anchor: middle; pointer-events: none; }
      .label-small { fill: #2a3a4a; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; text-anchor: middle; pointer-events: none; }
      .label-title { fill: #2a3a4a; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; }
      .icon { font-size: 20px; pointer-events: none; }
      .stair-icon { font-size: 22px; pointer-events: none; }
    </style>
  </defs>

  <!-- Фон -->
  <rect class="bg" width="1400" height="1000"/>

  <!-- ==================== ОСНОВНОЙ КОНТУР ЭТАЖА ==================== -->
  <path class="corridor" d="
    M 200,60
    L 1200,60
    L 1200,260
    L 1320,260
    L 1320,360
    L 1260,360
    L 1260,420
    L 1320,420
    L 1320,520
    L 1260,520
    L 1260,580
    L 1320,580
    L 1320,680
    L 1200,680
    L 1200,940
    L 200,940
    A 440,440 0 0,1 200,60
    Z"/>

  <!-- ==================== ВЕРХНЯЯ ЧАСТЬ (северная стена) ==================== -->

  <!-- 244 -->
  <g class="room-group" data-room="244">
    <rect class="room" x="220" y="75" width="70" height="60" onclick="selectRoom('244')"/>
    <text class="label-small" x="255" y="110">244</text>
  </g>

  <!-- 246 -->
  <g class="room-group" data-room="246">
    <rect class="room" x="300" y="75" width="70" height="60" onclick="selectRoom('246')"/>
    <text class="label-small" x="335" y="110">246</text>
  </g>

  <!-- WC мужской (верхний) -->
  <g class="room-group" data-room="WC_M_top">
    <rect class="room-special" x="380" y="75" width="70" height="60" onclick="selectRoom('WC_M_top')"/>
    <text class="label-small" x="400" y="100">WC</text>
    <text class="icon" x="425" y="110">♂</text>
  </g>

  <!-- 250 -->
  <g class="room-group" data-room="250">
    <rect class="room" x="460" y="75" width="70" height="60" onclick="selectRoom('250')"/>
    <text class="label-small" x="495" y="110">250</text>
  </g>

  <!-- 252а -->
  <g class="room-group" data-room="252a">
    <rect class="room" x="540" y="75" width="70" height="60" onclick="selectRoom('252a')"/>
    <text class="label-small" x="575" y="110">252а</text>
  </g>

  <!-- 252 -->
  <g class="room-group" data-room="252">
    <rect class="room" x="620" y="75" width="70" height="60" onclick="selectRoom('252')"/>
    <text class="label-small" x="655" y="110">252</text>
  </g>

  <!-- 254 -->
  <g class="room-group" data-room="254">
    <rect class="room" x="700" y="75" width="70" height="60" onclick="selectRoom('254')"/>
    <text class="label-small" x="735" y="110">254</text>
  </g>

  <!-- 254В -->
  <g class="room-group" data-room="254B">
    <rect class="room" x="780" y="75" width="70" height="60" onclick="selectRoom('254B')"/>
    <text class="label-small" x="815" y="110">254В</text>
  </g>

  <!-- 256 -->
  <g class="room-group" data-room="256">
    <rect class="room" x="860" y="75" width="70" height="60" onclick="selectRoom('256')"/>
    <text class="label-small" x="895" y="110">256</text>
  </g>

  <!-- ==================== ВТОРАЯ ЛИНИЯ СВЕРХУ ==================== -->

  <!-- 242 -->
  <g class="room-group" data-room="242">
    <rect class="room" x="220" y="145" width="70" height="80" onclick="selectRoom('242')"/>
    <text class="label" x="255" y="190">242</text>
  </g>

  <!-- 213 -->
  <g class="room-group" data-room="213">
    <rect class="room" x="300" y="145" width="70" height="80" onclick="selectRoom('213')"/>
    <text class="label" x="335" y="190">213</text>
  </g>

  <!-- 217 -->
  <g class="room-group" data-room="217">
    <rect class="room" x="380" y="145" width="230" height="80" onclick="selectRoom('217')"/>
    <text class="label" x="495" y="190">217</text>
  </g>

  <!-- 219 -->
  <g class="room-group" data-room="219">
    <rect class="room" x="620" y="145" width="150" height="140" onclick="selectRoom('219')"/>
    <text class="label" x="695" y="220">219</text>
  </g>

  <!-- 258 -->
  <g class="room-group" data-room="258">
    <rect class="room" x="860" y="145" width="70" height="80" onclick="selectRoom('258')"/>
    <text class="label" x="895" y="190">258</text>
  </g>

  <!-- 260 -->
  <g class="room-group" data-room="260">
    <rect class="room" x="860" y="235" width="70" height="80" onclick="selectRoom('260')"/>
    <text class="label" x="895" y="280">260</text>
  </g>

  <!-- ==================== ЛЕВАЯ ЧАСТЬ (западная стена) ==================== -->

  <!-- WC мужской (левый) -->
  <g class="room-group" data-room="WC_M_left">
    <rect class="room-special" x="75" y="155" width="130" height="70" onclick="selectRoom('WC_M_left')"/>
    <text class="label-small" x="110" y="185">WC</text>
    <text class="icon" x="160" y="195">♂</text>
  </g>

  <!-- 238 -->
  <g class="room-group" data-room="238">
    <rect class="room" x="75" y="235" width="130" height="75" onclick="selectRoom('238')"/>
    <text class="label" x="140" y="277">238</text>
  </g>

  <!-- 236 -->
  <g class="room-group" data-room="236">
    <rect class="room" x="75" y="320" width="130" height="75" onclick="selectRoom('236')"/>
    <text class="label" x="140" y="362">236</text>
  </g>

  <!-- 234 -->
  <g class="room-group" data-room="234">
    <rect class="room" x="75" y="405" width="130" height="75" onclick="selectRoom('234')"/>
    <text class="label" x="140" y="447">234</text>
  </g>

  <!-- 232 -->
  <g class="room-group" data-room="232">
    <rect class="room" x="75" y="490" width="130" height="75" onclick="selectRoom('232')"/>
    <text class="label" x="140" y="532">232</text>
  </g>

  <!-- 230 -->
  <g class="room-group" data-room="230">
    <rect class="room" x="75" y="575" width="130" height="75" onclick="selectRoom('230')"/>
    <text class="label" x="140" y="617">230</text>
  </g>

  <!-- WC женский -->
  <g class="room-group" data-room="WC_F">
    <rect class="room-special" x="75" y="660" width="130" height="70" onclick="selectRoom('WC_F')"/>
    <text class="label-small" x="110" y="690">WC</text>
    <text class="icon" x="160" y="700">♀</text>
  </g>

  <!-- 226 -->
  <g class="room-group" data-room="226">
    <rect class="room" x="75" y="740" width="130" height="90" onclick="selectRoom('226')"/>
    <text class="label" x="140" y="790">226</text>
  </g>

  <!-- ==================== ЦЕНТР (МАЛЫЙ АКТОВЫЙ ЗАЛ) ==================== -->

  <!-- Полукруглая форма зала с круглыми столами -->
  <path class="room" d="M 470,380 A 130,130 0 0,1 730,380 L 730,560 L 470,560 Z" onclick="selectRoom('201')" style="cursor:pointer"/>
  
  <!-- Название -->
  <text class="label-title" x="600" y="470" font-size="14" font-weight="bold" fill="#2a3a4a" pointer-events="none">МАЛЫЙ</text>
  <text class="label-title" x="600" y="490" font-size="14" font-weight="bold" fill="#2a3a4a" pointer-events="none">АКТОВЫЙ ЗАЛ</text>
  
  <!-- Круглые столы -->
  <circle cx="510" cy="420" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="560" cy="400" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="620" cy="395" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="680" cy="410" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="510" cy="480" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="560" cy="510" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="620" cy="525" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>
  <circle cx="680" cy="510" r="8" fill="none" stroke="#2a3a4a" stroke-width="1.5" pointer-events="none"/>

  <!-- 201 -->
  <g class="room-group" data-room="201">
    <rect class="room" x="735" y="380" width="180" height="180" onclick="selectRoom('201')"/>
    <text class="label" x="825" y="475">201</text>
  </g>

  <!-- 221 -->
  <g class="room-group" data-room="221">
    <rect class="room" x="735" y="300" width="80" height="70" onclick="selectRoom('221')"/>
    <text class="label" x="775" y="340">221</text>
  </g>

  <!-- ==================== ПРАВАЯ ЧАСТЬ ==================== -->

  <!-- 202 -->
  <g class="room-group" data-room="202">
    <rect class="room" x="940" y="380" width="100" height="90" onclick="selectRoom('202')"/>
    <text class="label" x="990" y="430">202</text>
  </g>

  <!-- 204 -->
  <g class="room-group" data-room="204">
    <rect class="room" x="940" y="480" width="100" height="90" onclick="selectRoom('204')"/>
    <text class="label" x="990" y="530">204</text>
  </g>

  <!-- 206 -->
  <g class="room-group" data-room="206">
    <rect class="room" x="940" y="580" width="100" height="90" onclick="selectRoom('206')"/>
    <text class="label" x="990" y="630">206</text>
  </g>

  <!-- ==================== НИЖНЯЯ ЧАСТЬ ==================== -->

  <!-- 203 -->
  <g class="room-group" data-room="203">
    <rect class="room" x="735" y="570" width="80" height="70" onclick="selectRoom('203')"/>
    <text class="label" x="775" y="610">203</text>
  </g>

  <!-- 205 -->
  <g class="room-group" data-room="205">
    <rect class="room" x="735" y="650" width="120" height="120" onclick="selectRoom('205')"/>
    <text class="label" x="795" y="715">205</text>
  </g>

  <!-- 208 -->
  <g class="room-group" data-room="208">
    <rect class="room" x="940" y="720" width="100" height="90" onclick="selectRoom('208')"/>
    <text class="label" x="990" y="770">208</text>
  </g>

  <!-- 210 -->
  <g class="room-group" data-room="210">
    <rect class="room" x="940" y="820" width="100" height="90" onclick="selectRoom('210')"/>
    <text class="label" x="990" y="870">210</text>
  </g>

  <!-- 212 -->
  <g class="room-group" data-room="212">
    <rect class="room" x="940" y="920" width="100" height="20" onclick="selectRoom('212')" style="display:none"/>
    <rect class="room" x="940" y="820" width="100" height="90" onclick="selectRoom('212')"/>
    <text class="label" x="990" y="870">212</text>
  </g>

  <!-- 207 -->
  <g class="room-group" data-room="207">
    <rect class="room" x="580" y="780" width="100" height="85" onclick="selectRoom('207')"/>
    <text class="label" x="630" y="827">207</text>
  </g>

  <!-- 209 -->
  <g class="room-group" data-room="209">
    <rect class="room" x="470" y="780" width="100" height="85" onclick="selectRoom('209')"/>
    <text class="label" x="520" y="827">209</text>
  </g>

  <!-- 211 -->
  <g class="room-group" data-room="211">
    <rect class="room" x="360" y="780" width="100" height="85" onclick="selectRoom('211')"/>
    <text class="label" x="410" y="827">211</text>
  </g>

  <!-- ==================== САМЫЙ НИЗ (южная стена) ==================== -->

  <!-- 224 -->
  <g class="room-group" data-room="224">
    <rect class="room" x="220" y="875" width="90" height="65" onclick="selectRoom('224')"/>
    <text class="label" x="265" y="912">224</text>
  </g>

  <!-- 222 -->
  <g class="room-group" data-room="222">
    <rect class="room" x="320" y="875" width="90" height="65" onclick="selectRoom('222')"/>
    <text class="label" x="365" y="912">222</text>
  </g>

  <!-- 220 -->
  <g class="room-group" data-room="220">
    <rect class="room" x="420" y="875" width="90" height="65" onclick="selectRoom('220')"/>
    <text class="label" x="465" y="912">220</text>
  </g>

  <!-- 218 -->
  <g class="room-group" data-room="218">
    <rect class="room" x="520" y="875" width="70" height="65" onclick="selectRoom('218')"/>
    <text class="label" x="555" y="912">218</text>
  </g>

  <!-- WC нижний -->
  <g class="room-group" data-room="WC_bottom">
    <rect class="room-special" x="600" y="875" width="70" height="65" onclick="selectRoom('WC_bottom')"/>
    <text class="label-small" x="620" y="900">WC</text>
    <text class="icon" x="645" y="910">♂</text>
  </g>

  <!-- ==================== ЛЕСТНИЦЫ ==================== -->
  <g class="stairs">
    <!-- У 244 (верхний левый угол) -->
    <text class="stair-icon" x="300" y="100" font-size="24">🏃</text>
    <!-- У 213 -->
    <text class="stair-icon" x="380" y="180" font-size="24">🏃</text>
    <!-- У 234 (левая сторона, середина) -->
    <text class="stair-icon" x="220" y="440" font-size="24">🏃</text>
    <!-- У 260 (правая сторона) -->
    <text class="stair-icon" x="1030" y="280" font-size="24">🏃</text>
    <!-- У 203 -->
    <text class="stair-icon" x="830" y="610" font-size="24">🏃</text>
    <!-- У 206 (правая сторона) -->
    <text class="stair-icon" x="1050" y="630" font-size="24">🏃</text>
    <!-- У 226 (нижний левый угол) -->
    <text class="stair-icon" x="220" y="790" font-size="24">🏃</text>
    <!-- У WC нижнего -->
    <text class="stair-icon" x="680" y="910" font-size="24">🏃</text>
  </g>

  <!-- ==================== ВНЕШНИЙ КОНТУР ==================== -->
  <path class="wall" d="
    M 200,60
    L 1200,60
    L 1200,260
    L 1320,260
    L 1320,360
    L 1260,360
    L 1260,420
    L 1320,420
    L 1320,520
    L 1260,520
    L 1260,580
    L 1320,580
    L 1320,680
    L 1200,680
    L 1200,940
    L 200,940
    A 440,440 0 0,1 200,60
    Z"/>

  <script type="text/javascript">
    <![CDATA[
    function selectRoom(roomId) {
      console.log('Выбран кабинет: ' + roomId);
      if (window.onRoomSelect) {
        window.onRoomSelect(roomId);
      }
      alert('Кабинет: ' + roomId);
    }
    ]]>
  </script>
</svg>
    `,

   3: `<svg viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg" id="floor-3-svg" data-floor="3">
  <defs><style>
    .corridor{fill:#f8fafc;stroke:#e2e8f0;stroke-width:2}
    .room{fill:#ffffff;stroke:#cbd5e1;stroke-width:2;cursor:pointer;transition:fill 0.2s}
    .room:hover{fill:#fef3c7}
    .room-label{fill:#1e293b;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;text-anchor:middle;pointer-events:none}
    .sub-label{fill:#64748b;font-family:Arial,sans-serif;font-size:9px;text-anchor:middle;pointer-events:none}
    .stairs{fill:#e2e8f0;stroke:#94a3b8;stroke-width:2;cursor:pointer}
    .wc{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2;cursor:pointer}
    .icon{fill:#475569;font-size:14px;text-anchor:middle;pointer-events:none}
    .hall{fill:#1e293b;stroke:#0f172a;stroke-width:2}
  </style></defs>
  
  <!-- Коридоры -->
  <rect class="corridor" x="50" y="50" width="1100" height="800" rx="8"/>
  
  <!-- ЦЕНТРАЛЬНЫЙ ЗАЛ (большой) -->
  <path class="hall" d="M 280 180 L 920 180 L 920 520 L 720 520 L 720 620 L 480 620 L 480 520 L 280 520 Z" onclick="selectRoom('300',3)"/>
  <text class="room-label" x="600" y="400" fill="white" font-size="24">300</text>
  
  <!-- ВЕРХНИЙ РЯД (дуга) -->
  <g onclick="selectRoom('326',3)"><rect class="room" x="180" y="70" width="80" height="70"/><text class="room-label" x="220" y="110">326</text></g>
  <g onclick="selectRoom('WC3_F_TOP',3)"><rect class="wc" x="270" y="70" width="60" height="70"/><text class="icon" x="300" y="100"></text><text class="sub-label" x="300" y="120">Ж</text></g>
  <g onclick="selectRoom('330',3)"><rect class="room" x="340" y="70" width="70" height="70"/><text class="room-label" x="375" y="110">330</text></g>
  <g onclick="selectRoom('332',3)"><rect class="room" x="420" y="70" width="70" height="70"/><text class="room-label" x="455" y="110">332</text></g>
  <g onclick="selectRoom('334',3)"><rect class="room" x="500" y="70" width="70" height="70"/><text class="room-label" x="535" y="110">334</text></g>
  <g onclick="selectRoom('336',3)"><rect class="room" x="580" y="70" width="70" height="70"/><text class="room-label" x="615" y="110">336</text></g>
  <g onclick="selectRoom('338',3)"><rect class="room" x="660" y="70" width="70" height="70"/><text class="room-label" x="695" y="110">338</text></g>
  <g onclick="selectRoom('340',3)"><rect class="room" x="740" y="70" width="70" height="70"/><text class="room-label" x="775" y="110">340</text></g>
  <g onclick="selectRoom('342',3)"><rect class="room" x="820" y="70" width="70" height="70"/><text class="room-label" x="855" y="110">342</text></g>
  <g onclick="selectRoom('WC3_M_TOP',3)"><rect class="wc" x="900" y="70" width="60" height="70"/><text class="icon" x="930" y="100"></text><text class="sub-label" x="930" y="120">М</text></g>
  <g onclick="selectRoom('346',3)"><rect class="room" x="970" y="70" width="70" height="70"/><text class="room-label" x="1005" y="110">346</text></g>
  <g onclick="selectRoom('STAIR3_TOP',3)"><rect class="stairs" x="1050" y="70" width="60" height="70"/><text class="icon" x="1080" y="110">🪜</text></g>
  <g onclick="selectRoom('348',3)"><rect class="room" x="1090" y="150" width="60" height="70"/><text class="room-label" x="1120" y="190">348</text></g>
  
  <!-- ЛЕВАЯ СТОРОНА (вертикально) -->
  <g onclick="selectRoom('324',3)"><rect class="room" x="80" y="160" width="70" height="70"/><text class="room-label" x="115" y="200">324</text></g>
  <g onclick="selectRoom('322',3)"><rect class="room" x="80" y="240" width="70" height="70"/><text class="room-label" x="115" y="280">322</text></g>
  <g onclick="selectRoom('320',3)"><rect class="room" x="80" y="320" width="70" height="70"/><text class="room-label" x="115" y="360">320</text></g>
  <g onclick="selectRoom('318',3)"><rect class="room" x="80" y="400" width="70" height="70"/><text class="room-label" x="115" y="440">318</text></g>
  <g onclick="selectRoom('WC3_F_LEFT',3)"><rect class="wc" x="80" y="480" width="70" height="70"/><text class="icon" x="115" y="515"></text><text class="sub-label" x="115" y="535">Ж</text></g>
  <g onclick="selectRoom('STAIR3_LEFT',3)"><rect class="stairs" x="80" y="560" width="70" height="70"/><text class="icon" x="115" y="600">🪜</text></g>
  
  <!-- ВНУТРЕННИЙ ЛЕВЫЙ РЯД -->
  <g onclick="selectRoom('317',3)"><rect class="room" x="170" y="160" width="70" height="100"/><text class="room-label" x="205" y="215">317</text></g>
  <g onclick="selectRoom('315',3)"><rect class="room" x="170" y="270" width="70" height="100"/><text class="room-label" x="205" y="325">315</text></g>
  <g onclick="selectRoom('313',3)"><rect class="room" x="170" y="380" width="70" height="100"/><text class="room-label" x="205" y="435">313</text></g>
  <g onclick="selectRoom('311',3)"><rect class="room" x="170" y="490" width="70" height="90"/><text class="room-label" x="205" y="540">311</text></g>
  <g onclick="selectRoom('309',3)"><rect class="room" x="250" y="490" width="60" height="90"/><text class="room-label" x="280" y="540">309</text></g>
  <g onclick="selectRoom('307',3)"><rect class="room" x="320" y="490" width="60" height="90"/><text class="room-label" x="350" y="540">307</text></g>
  
  <!-- ПРАВАЯ СТОРОНА (вертикально) -->
  <g onclick="selectRoom('319',3)"><rect class="room" x="970" y="160" width="70" height="70"/><text class="room-label" x="1005" y="200">319</text></g>
  <g onclick="selectRoom('STAIR3_RIGHT',3)"><rect class="stairs" x="970" y="240" width="70" height="70"/><text class="icon" x="1005" y="280">🪜</text></g>
  <g onclick="selectRoom('WC3_F_RIGHT',3)"><rect class="wc" x="970" y="320" width="70" height="70"/><text class="icon" x="1005" y="355"></text><text class="sub-label" x="1005" y="375">Ж</text></g>
  <g onclick="selectRoom('325',3)"><rect class="room" x="970" y="400" width="70" height="100"/><text class="room-label" x="1005" y="455">325</text></g>
  <g onclick="selectRoom('356',3)"><rect class="room" x="1090" y="240" width="60" height="100"/><text class="room-label" x="1120" y="295">356</text></g>
  <g onclick="selectRoom('358',3)"><rect class="room" x="1090" y="350" width="60" height="100"/><text class="room-label" x="1120" y="405">358</text></g>
  <g onclick="selectRoom('358B',3)"><rect class="room" x="1090" y="460" width="60" height="70"/><text class="room-label" x="1120" y="495">358В</text></g>
  <g onclick="selectRoom('350',3)"><rect class="room" x="1090" y="160" width="60" height="70"/><text class="room-label" x="1120" y="200">350</text></g>
  <g onclick="selectRoom('WC3_M_RIGHT',3)"><rect class="wc" x="1090" y="240" width="60" height="70"/><text class="icon" x="1120" y="275"></text><text class="sub-label" x="1120" y="295">М</text></g>
  
  <!-- ВНУТРЕННИЙ ПРАВЫЙ РЯД -->
  <g onclick="selectRoom('305',3)"><rect class="room" x="490" y="490" width="90" height="70"/><text class="room-label" x="535" y="530">305</text></g>
  <g onclick="selectRoom('331',3)"><rect class="room" x="720" y="490" width="90" height="70"/><text class="room-label" x="765" y="530">331</text></g>
  <g onclick="selectRoom('329',3)"><rect class="room" x="820" y="490" width="120" height="90"/><text class="room-label" x="880" y="540">329</text></g>
  
  <!-- НИЖНИЙ РЯД -->
  <g onclick="selectRoom('312',3)"><rect class="room" x="80" y="650" width="90" height="80"/><text class="room-label" x="125" y="695">312</text></g>
  <g onclick="selectRoom('310',3)"><rect class="room" x="180" y="650" width="90" height="80"/><text class="room-label" x="225" y="695">310</text></g>
  <g onclick="selectRoom('308',3)"><rect class="room" x="280" y="650" width="90" height="80"/><text class="room-label" x="325" y="695">308</text></g>
  <g onclick="selectRoom('STAIR3_BOTTOM_LEFT',3)"><rect class="stairs" x="480" y="650" width="60" height="80"/><text class="icon" x="510" y="695">🪜</text></g>
  <g onclick="selectRoom('306',3)"><rect class="room" x="550" y="650" width="90" height="80"/><text class="room-label" x="595" y="685">ЕДИНОЕ</text><text class="sub-label" x="595" y="700">ОКНО 306</text></g>
  <g onclick="selectRoom('DEAN',3)"><rect class="room" x="650" y="650" width="100" height="80"/><text class="room-label" x="700" y="685">ДЕКАНАТ</text><text class="sub-label" x="700" y="700">304</text></g>
  <g onclick="selectRoom('302',3)"><rect class="room" x="760" y="650" width="90" height="80"/><text class="room-label" x="805" y="685">ОТДЕЛ</text><text class="sub-label" x="805" y="700">ПРАКТИКИ 302</text></g>
  <g onclick="selectRoom('STAIR3_BOTTOM_RIGHT',3)"><rect class="stairs" x="860" y="650" width="60" height="80"/><text class="icon" x="890" y="695">🪜</text></g>
  <g onclick="selectRoom('364',3)"><rect class="room" x="930" y="650" width="80" height="80"/><text class="room-label" x="970" y="695">364</text></g>
  <g onclick="selectRoom('362',3)"><rect class="room" x="1020" y="650" width="80" height="80"/><text class="room-label" x="1060" y="695">362</text></g>
  <g onclick="selectRoom('360',3)"><rect class="room" x="1110" y="650" width="60" height="80"/><text class="room-label" x="1140" y="695">360</text></g>
</svg>`,

    4: `<svg viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg" id="floor-4-svg" data-floor="4">
  <defs><style>
    .corridor{fill:#f8fafc;stroke:#e2e8f0;stroke-width:2}
    .room{fill:#ffffff;stroke:#cbd5e1;stroke-width:2;cursor:pointer;transition:fill 0.2s}
    .room:hover{fill:#fef3c7}
    .room-label{fill:#1e293b;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;text-anchor:middle;pointer-events:none}
    .sub-label{fill:#64748b;font-family:Arial,sans-serif;font-size:9px;text-anchor:middle;pointer-events:none}
    .stairs{fill:#e2e8f0;stroke:#94a3b8;stroke-width:2;cursor:pointer}
    .wc{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2;cursor:pointer}
    .elevator{fill:#e2e8f0;stroke:#94a3b8;stroke-width:2;cursor:pointer}
    .icon{fill:#475569;font-size:14px;text-anchor:middle;pointer-events:none}
    .hall{fill:#1e293b;stroke:#0f172a;stroke-width:2}
  </style></defs>
  
  <!-- Фон -->
  <rect class="corridor" x="40" y="40" width="1120" height="820" rx="8"/>
  
  <!-- ===== ЛЕВОЕ КРЫЛО ===== -->
  <g onclick="selectRoom('420',4)"><rect class="room" x="150" y="60" width="120" height="80"/><text class="room-label" x="210" y="105">420</text></g>
  <g onclick="selectRoom('STAIR4_TL',4)"><rect class="stairs" x="80" y="60" width="60" height="80"/><text class="icon" x="110" y="105">🪜</text></g>
  
  <g onclick="selectRoom('418',4)"><rect class="room" x="80" y="150" width="70" height="90"/><text class="room-label" x="115" y="200">418</text></g>
  <g onclick="selectRoom('416',4)"><rect class="room" x="80" y="250" width="70" height="90"/><text class="room-label" x="115" y="300">416</text></g>
  <g onclick="selectRoom('414',4)"><rect class="room" x="80" y="350" width="70" height="90"/><text class="room-label" x="115" y="400">414</text></g>
  <g onclick="selectRoom('412',4)"><rect class="room" x="80" y="450" width="70" height="90"/><text class="room-label" x="115" y="500">412</text></g>
  
  <g onclick="selectRoom('WC4_M',4)"><rect class="wc" x="80" y="550" width="70" height="70"/><text class="icon" x="115" y="590">🚻</text><text class="sub-label" x="115" y="605">М</text></g>
  <g onclick="selectRoom('STAIR4_BL',4)"><rect class="stairs" x="80" y="630" width="70" height="70"/><text class="icon" x="115" y="670">🪜</text></g>
  
  <g onclick="selectRoom('409',4)"><rect class="room" x="160" y="150" width="80" height="100"/><text class="room-label" x="200" y="205">409</text></g>
  <g onclick="selectRoom('407',4)"><rect class="room" x="160" y="260" width="80" height="100"/><text class="room-label" x="200" y="315">407</text></g>
  <g onclick="selectRoom('405',4)"><rect class="room" x="160" y="370" width="80" height="100"/><text class="room-label" x="200" y="425">405</text></g>
  
  <g onclick="selectRoom('403',4)"><rect class="room" x="160" y="480" width="130" height="90"/><text class="room-label" x="225" y="520">ТЕХЦЕНТР</text><text class="sub-label" x="225" y="540">403</text></g>
  <g onclick="selectRoom('401',4)"><rect class="room" x="300" y="480" width="70" height="90"/><text class="room-label" x="335" y="530">401</text></g>
  <g onclick="selectRoom('ELEV4_L',4)"><rect class="elevator" x="380" y="480" width="60" height="70"/><text class="icon" x="410" y="520"></text></g>
  
  <g onclick="selectRoom('406',4)"><rect class="room" x="80" y="710" width="100" height="90"/><text class="room-label" x="130" y="760">406</text></g>
  <g onclick="selectRoom('404',4)"><rect class="room" x="190" y="710" width="180" height="90"/><text class="room-label" x="280" y="760">404</text></g>
  <g onclick="selectRoom('STAIR4_BC',4)"><rect class="stairs" x="380" y="710" width="60" height="90"/><text class="icon" x="410" y="760">🪜</text></g>
  
  <!-- ===== ЦЕНТР - БОЛЬШОЙ АКТОВЫЙ ЗАЛ 400 ===== -->
  <path class="hall" d="M 460 280 Q 460 200 600 200 Q 740 200 740 280 L 740 600 L 460 600 Z" onclick="selectRoom('400',4)"/>
  <text class="room-label" x="600" y="380" fill="white" font-size="18">БОЛЬШОЙ</text>
  <text class="room-label" x="600" y="410" fill="white" font-size="18">АКТОВЫЙ ЗАЛ</text>
  <text class="room-label" x="600" y="460" fill="white" font-size="24">400</text>
  
  <circle cx="520" cy="320" r="6" fill="white" stroke="#0f172a" stroke-width="2"/>
  <circle cx="680" cy="320" r="6" fill="white" stroke="#0f172a" stroke-width="2"/>
  <circle cx="520" cy="380" r="6" fill="white" stroke="#0f172a" stroke-width="2"/>
  <circle cx="680" cy="380" r="6" fill="white" stroke="#0f172a" stroke-width="2"/>
  <circle cx="520" cy="440" r="6" fill="white" stroke="#0f172a" stroke-width="2"/>
  <circle cx="680" cy="440" r="6" fill="white" stroke="#0f172a" stroke-width="2"/>
  
  <g onclick="selectRoom('STAIR4_BR',4)"><rect class="stairs" x="750" y="710" width="60" height="90"/><text class="icon" x="780" y="760">🪜</text></g>
  
  <!-- ===== ПРАВОЕ КРЫЛО (сближено) ===== -->
  
  <!-- 422 -->
  <g onclick="selectRoom('422',4)"><rect class="room" x="850" y="60" width="120" height="80"/><text class="room-label" x="910" y="105">422</text></g>
  
  <!-- Лестница -->
  <g onclick="selectRoom('STAIR4_TR',4)"><rect class="stairs" x="850" y="150" width="70" height="70"/><text class="icon" x="885" y="190">🪜</text></g>
  
  <!-- Бухгалтерия -->
  <g onclick="selectRoom('ACCOUNTING',4)"><rect class="room" x="980" y="150" width="100" height="70"/><text class="room-label" x="1030" y="180">БУХГАЛ-</text><text class="sub-label" x="1030" y="195">ТЕРИЯ</text></g>
  
  <!-- 411 -->
  <g onclick="selectRoom('411',4)"><rect class="room" x="850" y="230" width="70" height="70"/><text class="room-label" x="885" y="270">411</text></g>
  
  <!-- 424 -->
  <g onclick="selectRoom('424',4)"><rect class="room" x="980" y="230" width="100" height="70"/><text class="room-label" x="1030" y="270">424</text></g>
  
  <!-- Лестница -->
  <g onclick="selectRoom('STAIR4_RM',4)"><rect class="stairs" x="850" y="310" width="70" height="60"/><text class="icon" x="885" y="345">🪜</text></g>
  
  <!-- 426 -->
  <g onclick="selectRoom('426',4)"><rect class="room" x="980" y="310" width="100" height="60"/><text class="room-label" x="1030" y="345">426</text></g>
  
  <!-- WC -->
  <g onclick="selectRoom('WC4_M2',4)"><rect class="wc" x="980" y="380" width="100" height="60"/><text class="icon" x="1030" y="415">🚻</text><text class="sub-label" x="1030" y="430">WC</text></g>
  
  <!-- Ректор 415 -->
  <g onclick="selectRoom('RECTOR',4)"><rect class="room" x="850" y="380" width="110" height="200"/><text class="room-label" x="905" y="470">РЕКТОР</text><text class="sub-label" x="905" y="490">415</text></g>
  
  <!-- 430 -->
  <g onclick="selectRoom('430',4)"><rect class="room" x="980" y="450" width="100" height="200"/><text class="room-label" x="1030" y="555">430</text></g>
  
  <!-- 417 -->
  <g onclick="selectRoom('417',4)"><rect class="room" x="850" y="590" width="110" height="110"/><text class="room-label" x="905" y="650">417</text></g>
  
  <!-- 434, 432 -->
  <g onclick="selectRoom('434',4)"><rect class="room" x="850" y="710" width="110" height="90"/><text class="room-label" x="905" y="760">434</text></g>
  <g onclick="selectRoom('432',4)"><rect class="room" x="980" y="710" width="100" height="90"/><text class="room-label" x="1030" y="760">432</text></g>
</svg>`,

    5: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="100%" height="100%">
  <defs>
    <style>
      .room { fill: #6b6360; stroke: #2a2a2a; stroke-width: 2; cursor: pointer; transition: fill 0.2s; }
      .room:hover { fill: #8a7e7a; }
      .corridor { fill: #d4d0cc; stroke: #2a2a2a; stroke-width: 2; }
      .wall { fill: none; stroke: #2a2a2a; stroke-width: 3; }
      .label { fill: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-anchor: middle; pointer-events: none; }
      .label-dark { fill: #2a2a2a; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; }
      .icon { font-size: 20px; pointer-events: none; }
    </style>
  </defs>

  <!-- Фон -->
  <rect width="1200" height="900" fill="#4a4a4a"/>

  <!-- ==================== ЛЕВЫЙ БЛОК ==================== -->
  
  <!-- Коридор левого блока (основа) -->
  <path class="corridor" d="M 60,80 L 290,80 L 290,520 L 500,520 L 500,820 L 400,820 L 400,700 L 60,700 Z"/>

  <!-- Кабинет 520 -->
  <g class="room-group" data-room="520">
    <rect class="room" x="200" y="95" width="80" height="95" onclick="selectRoom('520')"/>
    <text class="label" x="240" y="150">520</text>
  </g>

  <!-- Кабинет 520A -->
  <g class="room-group" data-room="520A">
    <rect class="room" x="200" y="195" width="80" height="55" onclick="selectRoom('520A')"/>
    <text class="label" x="240" y="228">520A</text>
  </g>

  <!-- Кабинет 509 -->
  <g class="room-group" data-room="509">
    <rect class="room" x="200" y="255" width="80" height="60" onclick="selectRoom('509')"/>
    <text class="label" x="240" y="290">509</text>
  </g>

  <!-- Кабинет 507 -->
  <g class="room-group" data-room="507">
    <rect class="room" x="200" y="320" width="80" height="90" onclick="selectRoom('507')"/>
    <text class="label" x="240" y="370">507</text>
  </g>

  <!-- Кабинет 505 -->
  <g class="room-group" data-room="505">
    <rect class="room" x="200" y="415" width="80" height="95" onclick="selectRoom('505')"/>
    <text class="label" x="240" y="468">505</text>
  </g>

  <!-- Кабинет 518 -->
  <g class="room-group" data-room="518">
    <rect class="room" x="70" y="240" width="75" height="70" onclick="selectRoom('518')"/>
    <text class="label" x="108" y="280">518</text>
  </g>

  <!-- Кабинет 516 -->
  <g class="room-group" data-room="516">
    <rect class="room" x="70" y="315" width="75" height="90" onclick="selectRoom('516')"/>
    <text class="label" x="108" y="365">516</text>
  </g>

  <!-- Кабинет 514 -->
  <g class="room-group" data-room="514">
    <rect class="room" x="70" y="410" width="75" height="90" onclick="selectRoom('514')"/>
    <text class="label" x="108" y="460">514</text>
  </g>

  <!-- Кабинет 512 -->
  <g class="room-group" data-room="512">
    <rect class="room" x="70" y="505" width="75" height="70" onclick="selectRoom('512')"/>
    <text class="label" x="108" y="545">512</text>
  </g>

  <!-- WC женский -->
  <g class="room-group" data-room="WC_F">
    <rect class="room" x="70" y="580" width="75" height="50" onclick="selectRoom('WC_F')"/>
    <text class="label-dark" x="95" y="605">WC</text>
    <text class="icon" x="120" y="610"></text>
  </g>

  <!-- Кабинет 501 -->
  <g class="room-group" data-room="501">
    <rect class="room" x="150" y="540" width="180" height="130" onclick="selectRoom('501')"/>
    <text class="label" x="240" y="610">501</text>
  </g>

  <!-- Кабинет 506 -->
  <g class="room-group" data-room="506">
    <rect class="room" x="60" y="685" width="170" height="110" onclick="selectRoom('506')"/>
    <text class="label" x="145" y="745">506</text>
  </g>

  <!-- Кабинет 502 -->
  <g class="room-group" data-room="502">
    <rect class="room" x="235" y="685" width="165" height="110" onclick="selectRoom('502')"/>
    <text class="label" x="318" y="745">502</text>
  </g>

  <!-- Лестницы левого блока -->
  <g class="stairs">
    <text class="icon" x="85" y="175" font-size="24"></text>
    <text class="icon" x="115" y="175" font-size="24">🚪</text>
    <text class="icon" x="85" y="645" font-size="24">🏃</text>
    <text class="icon" x="455" y="560" font-size="24">🏃</text>
    <text class="icon" x="455" y="585" font-size="16">🚪</text>
    <text class="icon" x="445" y="745" font-size="24">🏃</text>
  </g>

  <!-- ==================== ПРАВЫЙ БЛОК ==================== -->

  <!-- Коридор правого блока -->
  <path class="corridor" d="M 940,80 L 1170,80 L 1170,820 L 1070,820 L 1070,700 L 760,700 L 760,520 L 970,520 Z"/>

  <!-- Кабинет 522 -->
  <g class="room-group" data-room="522">
    <rect class="room" x="955" y="95" width="200" height="90" onclick="selectRoom('522')"/>
    <text class="label" x="1055" y="145">522</text>
  </g>

  <!-- Кабинет 511 -->
  <g class="room-group" data-room="511">
    <rect class="room" x="970" y="240" width="100" height="50" onclick="selectRoom('511')"/>
    <text class="label" x="1020" y="270">511</text>
  </g>

  <!-- Кабинет 526 -->
  <g class="room-group" data-room="526">
    <rect class="room" x="1100" y="240" width="60" height="50" onclick="selectRoom('526')"/>
    <text class="label" x="1130" y="270">526</text>
  </g>

  <!-- WC мужской -->
  <g class="room-group" data-room="WC_M">
    <rect class="room" x="1100" y="295" width="60" height="40" onclick="selectRoom('WC_M')"/>
    <text class="label-dark" x="1115" y="320">👨</text>
    <text class="label-dark" x="1140" y="320">WC</text>
  </g>

  <!-- Кабинет 530 -->
  <g class="room-group" data-room="530">
    <rect class="room" x="1100" y="340" width="60" height="90" onclick="selectRoom('530')"/>
    <text class="label" x="1130" y="390">530</text>
  </g>

  <!-- МЕД ЦЕНТР 515 -->
  <g class="room-group" data-room="515">
    <rect class="room" x="970" y="360" width="125" height="155" onclick="selectRoom('515')"/>
    <text class="label" x="1033" y="430">МЕД</text>
    <text class="label" x="1033" y="450">ЦЕНТР</text>
    <text class="label" x="1033" y="490">515</text>
  </g>

  <!-- Кабинет 532 -->
  <g class="room-group" data-room="532">
    <rect class="room" x="1100" y="435" width="60" height="150" onclick="selectRoom('532')"/>
    <text class="label" x="1130" y="515">532</text>
  </g>

  <!-- Кабинет 517 -->
  <g class="room-group" data-room="517">
    <rect class="room" x="870" y="540" width="225" height="130" onclick="selectRoom('517')"/>
    <text class="label" x="983" y="610">517</text>
  </g>

  <!-- Кабинет 5326 -->
  <g class="room-group" data-room="5326">
    <rect class="room" x="1100" y="590" width="60" height="50" onclick="selectRoom('5326')"/>
    <text class="label" x="1130" y="620">5326</text>
  </g>

  <!-- Кабинет 538 -->
  <g class="room-group" data-room="538">
    <rect class="room" x="870" y="685" width="160" height="110" onclick="selectRoom('538')"/>
    <text class="label" x="950" y="745">538</text>
  </g>

  <!-- Кабинет 534 -->
  <g class="room-group" data-room="534">
    <rect class="room" x="1035" y="685" width="135" height="110" onclick="selectRoom('534')"/>
    <text class="label" x="1103" y="745">534</text>
  </g>

  <!-- Лестницы правого блока -->
  <g class="stairs">
    <text class="icon" x="985" y="210" font-size="24">🏃</text>
    <text class="icon" x="1015" y="210" font-size="24">🚪</text>
    <text class="icon" x="985" y="305" font-size="24">🏃</text>
    <text class="icon" x="805" y="745" font-size="24">🏃</text>
  </g>

  <!-- Внешние контуры блоков -->
  <path class="wall" d="M 60,80 L 290,80 L 290,520 L 500,520 L 500,820 L 400,820 L 400,700 L 60,700 Z" fill="none" stroke="#1a1a1a" stroke-width="4"/>
  <path class="wall" d="M 940,80 L 1170,80 L 1170,820 L 1070,820 L 1070,700 L 760,700 L 760,520 L 970,520 Z" fill="none" stroke="#1a1a1a" stroke-width="4"/>

  <script type="text/javascript">
    <![CDATA[
    function selectRoom(roomId) {
      console.log('Выбран кабинет: ' + roomId);
      if (window.onRoomSelect) {
        window.onRoomSelect(roomId);
      }
      alert('Кабинет: ' + roomId);
    }
    ]]>
  </script>
</svg>`,

    6: `<svg viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg" id="floor-6-svg" data-floor="6">
  <defs><style>
    .corridor{fill:#f8fafc;stroke:#e2e8f0;stroke-width:2}
    .room{fill:#ffffff;stroke:#cbd5e1;stroke-width:2;cursor:pointer;transition:fill 0.2s}
    .room:hover{fill:#fef3c7}
    .room-label{fill:#1e293b;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;text-anchor:middle;pointer-events:none}
    .sub-label{fill:#64748b;font-family:Arial,sans-serif;font-size:10px;text-anchor:middle;pointer-events:none}
    .stairs{fill:#e2e8f0;stroke:#94a3b8;stroke-width:2;cursor:pointer}
    .wc{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2;cursor:pointer}
    .elevator{fill:#e2e8f0;stroke:#94a3b8;stroke-width:2;cursor:pointer}
    .icon{fill:#475569;font-size:14px;text-anchor:middle;pointer-events:none}
  </style></defs>
  
  <!-- Фон -->
  <rect class="corridor" x="40" y="40" width="1120" height="820" rx="8"/>
  
  <!-- ===== ЛЕВЫЙ БЛОК ===== -->
  
  <!-- 602 -->
  <g onclick="selectRoom('602',6)"><rect class="room" x="100" y="380" width="140" height="100"/><text class="room-label" x="170" y="435">602</text></g>
  
  <!-- Коридор между 602 и 603 -->
  <rect class="corridor" x="100" y="485" width="140" height="5"/>
  
  <!-- 603 -->
  <g onclick="selectRoom('603',6)"><rect class="room" x="100" y="495" width="80" height="70"/><text class="room-label" x="140" y="535">603</text></g>
  
  <!-- WC -->
  <g onclick="selectRoom('WC6_F',6)"><rect class="wc" x="100" y="575" width="80" height="60"/><text class="icon" x="140" y="610">🚻</text><text class="sub-label" x="140" y="625">WC</text></g>
  
  <!-- Лестница -->
  <g onclick="selectRoom('STAIR6_L1',6)"><rect class="stairs" x="100" y="645" width="80" height="60"/><text class="icon" x="140" y="680">🪜</text></g>
  
  <!-- Коридор между 603/WC и 601 -->
  <rect class="corridor" x="185" y="495" width="5" height="210"/>
  
  <!-- 601 -->
  <g onclick="selectRoom('601',6)"><rect class="room" x="195" y="495" width="220" height="140"/><text class="room-label" x="305" y="570">601</text></g>
  
  <!-- Лифт -->
  <g onclick="selectRoom('ELEV6_L',6)"><rect class="elevator" x="425" y="495" width="60" height="70"/><text class="icon" x="455" y="535"></text></g>
  
  <!-- Коридор между 601 и 607 -->
  <rect class="corridor" x="195" y="640" width="220" height="5"/>
  
  <!-- 607 -->
  <g onclick="selectRoom('607',6)"><rect class="room" x="195" y="650" width="220" height="100"/><text class="room-label" x="305" y="705">607</text></g>
  
  <!-- 606 -->
  <g onclick="selectRoom('606',6)"><rect class="room" x="100" y="715" width="80" height="90"/><text class="room-label" x="140" y="765">606</text></g>
  
  <!-- Коридор между 606 и 607 -->
  <rect class="corridor" x="185" y="715" width="5" height="90"/>
  
  <!-- Лестница -->
  <g onclick="selectRoom('STAIR6_L2',6)"><rect class="stairs" x="425" y="650" width="60" height="70"/><text class="icon" x="455" y="690">🪜</text></g>
  
  <!-- ===== ПРАВЫЙ БЛОК ===== -->
  
  <!-- Лестница -->
  <g onclick="selectRoom('STAIR6_R1',6)"><rect class="stairs" x="880" y="220" width="70" height="60"/><text class="icon" x="915" y="255">🪜</text></g>
  
  <!-- Коридор -->
  <rect class="corridor" x="880" y="285" width="70" height="5"/>
  
  <!-- WC -->
  <g onclick="selectRoom('WC6_M',6)"><rect class="wc" x="880" y="295" width="70" height="60"/><text class="icon" x="915" y="330">🚻</text><text class="sub-label" x="915" y="345">WC</text></g>
  
  <!-- Коридор -->
  <rect class="corridor" x="880" y="360" width="70" height="5"/>
  
  <!-- 616 -->
  <g onclick="selectRoom('616',6)"><rect class="room" x="880" y="370" width="70" height="70"/><text class="room-label" x="915" y="410">616</text></g>
  
  <!-- Коридор -->
  <rect class="corridor" x="880" y="445" width="70" height="5"/>
  
  <!-- 617 -->
  <g onclick="selectRoom('617',6)"><rect class="room" x="880" y="455" width="70" height="70"/><text class="room-label" x="915" y="495">617</text></g>
  
  <!-- Коридор между 616/617 и 613 -->
  <rect class="corridor" x="955" y="295" width="5" height="230"/>
  
  <!-- 613 -->
  <g onclick="selectRoom('613',6)"><rect class="room" x="965" y="295" width="80" height="70"/><text class="room-label" x="1005" y="335">613</text></g>
  
  <!-- Коридор -->
  <rect class="corridor" x="965" y="370" width="80" height="5"/>
  
  <!-- 612 -->
  <g onclick="selectRoom('612',6)"><rect class="room" x="965" y="380" width="100" height="220"/><text class="room-label" x="1015" y="495">612</text></g>
  
  <!-- Коридор между 617 и 618 -->
  <rect class="corridor" x="955" y="455" width="5" height="105"/>
  
  <!-- 618 -->
  <g onclick="selectRoom('618',6)"><rect class="room" x="800" y="455" width="150" height="120"/><text class="room-label" x="875" y="520">618</text></g>
  
  <!-- Лифт -->
  <g onclick="selectRoom('ELEV6_R',6)"><rect class="elevator" x="720" y="455" width="70" height="60"/><text class="icon" x="755" y="490">🛗</text></g>
  
  <!-- Коридор между 618 и 610/611 -->
  <rect class="corridor" x="800" y="580" width="150" height="5"/>
  
  <!-- Лестница -->
  <g onclick="selectRoom('STAIR6_R2',6)"><rect class="stairs" x="720" y="650" width="70" height="70"/><text class="icon" x="755" y="690">🪜</text></g>
  
  <!-- Коридор между лифтом и лестницей -->
  <rect class="corridor" x="720" y="520" width="5" height="125"/>
  
  <!-- 610 -->
  <g onclick="selectRoom('610',6)"><rect class="room" x="800" y="590" width="130" height="100"/><text class="room-label" x="865" y="645">610</text></g>
  
  <!-- Коридор между 610 и 611 -->
  <rect class="corridor" x="935" y="590" width="5" height="100"/>
  
  <!-- 611 -->
  <g onclick="selectRoom('611',6)"><rect class="room" x="945" y="590" width="120" height="100"/><text class="room-label" x="1005" y="645">611</text></g>
</svg>`
};

/* ГРАФ УЗЛОВ */
const NODES = {
    START: { f: 1, x: 100, y: 710, label: "Главный вход (102)" },
    "101": { f: 1, x: 475, y: 450, label: "101 (Атриум)" },
    "102": { f: 1, x: 840, y: 710, label: "102" },
    "103": { f: 1, x: 670, y: 590, label: "103" },
    "104": { f: 1, x: 750, y: 710, label: "104" },
    "105": { f: 1, x: 580, y: 590, label: "105" },
    "106": { f: 1, x: 660, y: 710, label: "106" },
    "107": { f: 1, x: 430, y: 710, label: "107" },
    "107A": { f: 1, x: 340, y: 710, label: "107А" },
    "110": { f: 1, x: 510, y: 710, label: "110" },
    "111": { f: 1, x: 630, y: 210, label: "111" },
    "112": { f: 1, x: 230, y: 710, label: "112 (Типография)" },
    "113": { f: 1, x: 630, y: 310, label: "113" },
    "115": { f: 1, x: 725, y: 310, label: "115 (Библиотека)" },
    "116": { f: 1, x: 110, y: 710, label: "116" },
    "120": { f: 1, x: 200, y: 480, label: "120" },
    "122": { f: 1, x: 200, y: 390, label: "122 (Приёмная комиссия)" },
    "124": { f: 1, x: 200, y: 300, label: "124 (Приёмная комиссия)" },
    "134": { f: 1, x: 210, y: 130, label: "134 (Тренажёрный зал)" },
    "138": { f: 1, x: 650, y: 120, label: "138 (Преподавательская)" },
    "140": { f: 1, x: 725, y: 210, label: "140" },
    "142": { f: 1, x: 760, y: 120, label: "142" },
    "144": { f: 1, x: 840, y: 170, label: "144 (Столовая)" },
    "146": { f: 1, x: 820, y: 420, label: "146" },
    "148": { f: 1, x: 820, y: 310, label: "148" },
    BUFFET: { f: 1, x: 300, y: 390, label: "Буфет" },
    WC1_F: { f: 1, x: 580, y: 710, label: "Санузел (Ж)" },
    WC1_M: { f: 1, x: 180, y: 220, label: "Санузел (М)" },
    WC1_F2: { f: 1, x: 250, y: 220, label: "Санузел (Ж)" },
    STAIR1_1: { f: 1, x: 105, y: 230, label: "Лестница №1" },
    STAIR1_2: { f: 1, x: 375, y: 610, label: "Лестница №2" },
    STAIR1_3: { f: 1, x: 675, y: 610, label: "Лестница №3" },
    STAIR1_4: { f: 1, x: 875, y: 430, label: "Лестница №4" },
    "201": { f: 2, x: 550, y: 350, label: "201 (Малый актовый зал)" },
    "202": { f: 2, x: 550, y: 670, label: "202" },
    "204": { f: 2, x: 460, y: 670, label: "204" },
    "206": { f: 2, x: 370, y: 670, label: "206" },
    "208": { f: 2, x: 280, y: 670, label: "208 (Комп. классы)" },
    "210": { f: 2, x: 190, y: 670, label: "210" },
    "212": { f: 2, x: 100, y: 670, label: "212" },
    "217": { f: 2, x: 930, y: 530, label: "217" },
    "219": { f: 2, x: 760, y: 530, label: "219" },
    "221": { f: 2, x: 850, y: 530, label: "221" },
    "224": { f: 2, x: 100, y: 530, label: "224" },
    "222": { f: 2, x: 190, y: 530, label: "222" },
    "220": { f: 2, x: 280, y: 530, label: "220" },
    "218": { f: 2, x: 370, y: 530, label: "218" },
    "226": { f: 2, x: 100, y: 390, label: "226" },
    "230": { f: 2, x: 190, y: 350, label: "230" },
    "232": { f: 2, x: 280, y: 310, label: "232" },
    "234": { f: 2, x: 370, y: 270, label: "234" },
    "236": { f: 2, x: 460, y: 240, label: "236" },
    "238": { f: 2, x: 550, y: 220, label: "238" },
    "242": { f: 2, x: 640, y: 220, label: "242" },
    "244": { f: 2, x: 730, y: 240, label: "244" },
    "246": { f: 2, x: 820, y: 270, label: "246" },
    "250": { f: 2, x: 900, y: 310, label: "250" },
    "252a": { f: 2, x: 930, y: 390, label: "252а" },
    "256": { f: 2, x: 760, y: 670, label: "256" },
    "258": { f: 2, x: 850, y: 670, label: "258" },
    "260": { f: 2, x: 930, y: 670, label: "260" },
    WC2_F: { f: 2, x: 360, y: 430, label: "Санузел (Ж)" },
    WC2_M: { f: 2, x: 630, y: 430, label: "Санузел (М)" },
    STAIR2_1: { f: 2, x: 105, y: 430, label: "Лестница №1" },
    STAIR2_2: { f: 2, x: 675, y: 610, label: "Лестница №2" },
    STAIR2_3: { f: 2, x: 875, y: 610, label: "Лестница №3" },
    "300": { f: 3, x: 500, y: 400, label: "300 (Центральный зал)" },
    "302": { f: 3, x: 680, y: 710, label: "302 (Отдел практики)" },
    "304": { f: 3, x: 560, y: 710, label: "304 (Деканат)" },
    "306": { f: 3, x: 440, y: 710, label: "306 (Единое окно)" },
    "307": { f: 3, x: 370, y: 590, label: "307" },
    "308": { f: 3, x: 330, y: 710, label: "308" },
    "309": { f: 3, x: 280, y: 590, label: "309" },
    "310": { f: 3, x: 220, y: 710, label: "310" },
    "311": { f: 3, x: 190, y: 590, label: "311" },
    "312": { f: 3, x: 110, y: 710, label: "312" },
    "313": { f: 3, x: 190, y: 480, label: "313" },
    "315": { f: 3, x: 190, y: 370, label: "315" },
    "317": { f: 3, x: 190, y: 260, label: "317" },
    "318": { f: 3, x: 100, y: 590, label: "318" },
    "320": { f: 3, x: 100, y: 480, label: "320" },
    "322": { f: 3, x: 100, y: 370, label: "322" },
    "324": { f: 3, x: 100, y: 260, label: "324" },
    "325": { f: 3, x: 910, y: 590, label: "325" },
    "326": { f: 3, x: 190, y: 150, label: "326" },
    "329": { f: 3, x: 800, y: 590, label: "329" },
    "330": { f: 3, x: 280, y: 150, label: "330" },
    "332": { f: 3, x: 370, y: 150, label: "332" },
    "334": { f: 3, x: 460, y: 150, label: "334" },
    "336": { f: 3, x: 550, y: 150, label: "336" },
    "338": { f: 3, x: 640, y: 150, label: "338" },
    "340": { f: 3, x: 730, y: 150, label: "340" },
    "342": { f: 3, x: 820, y: 150, label: "342" },
    "346": { f: 3, x: 910, y: 150, label: "346" },
    "348": { f: 3, x: 950, y: 260, label: "348" },
    "350": { f: 3, x: 950, y: 370, label: "350" },
    "356": { f: 3, x: 950, y: 480, label: "356" },
    "358": { f: 3, x: 950, y: 590, label: "358" },
    "360": { f: 3, x: 950, y: 710, label: "360" },
    "362": { f: 3, x: 870, y: 710, label: "362" },
    "364": { f: 3, x: 780, y: 710, label: "364" },
    DEAN: { f: 3, x: 560, y: 710, label: "Деканат" },
    WC3_F: { f: 3, x: 90, y: 480, label: "Санузел (Ж)" },
    WC3_F2: { f: 3, x: 270, y: 130, label: "Санузел (Ж)" },
    WC3_M: { f: 3, x: 810, y: 130, label: "Санузел (М)" },
    WC3_M2: { f: 3, x: 900, y: 380, label: "Санузел (М)" },
    STAIR3_1: { f: 3, x: 105, y: 330, label: "Лестница №1" },
    STAIR3_2: { f: 3, x: 375, y: 610, label: "Лестница №2" },
    STAIR3_3: { f: 3, x: 675, y: 610, label: "Лестница №3" },
    STAIR3_4: { f: 3, x: 875, y: 280, label: "Лестница №4" },
    "400": { f: 4, x: 500, y: 300, label: "400 (Большой актовый зал)" },
    "401": { f: 4, x: 310, y: 590, label: "401" },
    "403": { f: 4, x: 220, y: 590, label: "403 (Техцентр)" },
    "404": { f: 4, x: 230, y: 710, label: "404" },
    "405": { f: 4, x: 210, y: 480, label: "405" },
    "406": { f: 4, x: 110, y: 710, label: "406" },
    "407": { f: 4, x: 210, y: 370, label: "407" },
    "409": { f: 4, x: 210, y: 260, label: "409" },
    "411": { f: 4, x: 780, y: 260, label: "411" },
    "412": { f: 4, x: 100, y: 480, label: "412" },
    "414": { f: 4, x: 100, y: 370, label: "414" },
    "416": { f: 4, x: 100, y: 260, label: "416" },
    "417": { f: 4, x: 800, y: 590, label: "417" },
    "418": { f: 4, x: 100, y: 150, label: "418" },
    "420": { f: 4, x: 200, y: 150, label: "420" },
    "422": { f: 4, x: 790, y: 150, label: "422" },
    "424": { f: 4, x: 900, y: 150, label: "424 (Бухгалтерия)" },
    "426": { f: 4, x: 900, y: 260, label: "426" },
    "430": { f: 4, x: 900, y: 480, label: "430" },
    "432": { f: 4, x: 900, y: 710, label: "432" },
    "434": { f: 4, x: 790, y: 710, label: "434" },
    RECTOR: { f: 4, x: 790, y: 400, label: "Ректор (415)" },
    ACCOUNTING: { f: 4, x: 900, y: 150, label: "Бухгалтерия" },
    WC4_M: { f: 4, x: 90, y: 380, label: "Санузел (М)" },
    WC4_M2: { f: 4, x: 880, y: 280, label: "Санузел (М)" },
    STAIR4_1: { f: 4, x: 105, y: 230, label: "Лестница №1" },
    STAIR4_2: { f: 4, x: 375, y: 610, label: "Лестница №2" },
    STAIR4_3: { f: 4, x: 675, y: 610, label: "Лестница №3" },
    STAIR4_4: { f: 4, x: 875, y: 180, label: "Лестница №4" },
    "501": { f: 5, x: 330, y: 590, label: "501" },
    "502": { f: 5, x: 220, y: 710, label: "502 (Лицей)" },
    "505": { f: 5, x: 460, y: 480, label: "505" },
    "506": { f: 5, x: 110, y: 710, label: "506" },
    "507": { f: 5, x: 370, y: 480, label: "507" },
    "509": { f: 5, x: 280, y: 480, label: "509" },
    "511": { f: 5, x: 210, y: 150, label: "511" },
    "512": { f: 5, x: 370, y: 370, label: "512" },
    "514": { f: 5, x: 280, y: 370, label: "514" },
    "515": { f: 5, x: 550, y: 480, label: "515 (Мед. центр)" },
    "516": { f: 5, x: 190, y: 370, label: "516" },
    "517": { f: 5, x: 670, y: 530, label: "517 (Мед. кабинет)" },
    "518": { f: 5, x: 100, y: 370, label: "518" },
    "520": { f: 5, x: 100, y: 480, label: "520" },
    "520A": { f: 5, x: 190, y: 480, label: "520А" },
    "522": { f: 5, x: 110, y: 150, label: "522" },
    "526": { f: 5, x: 300, y: 150, label: "526" },
    "530": { f: 5, x: 390, y: 150, label: "530" },
    "532": { f: 5, x: 490, y: 150, label: "532" },
    "532A": { f: 5, x: 590, y: 150, label: "532б" },
    "534": { f: 5, x: 790, y: 710, label: "534" },
    "538": { f: 5, x: 790, y: 590, label: "538" },
    LYC: { f: 5, x: 220, y: 710, label: "Лицей" },
    MED: { f: 5, x: 670, y: 530, label: "Мед. кабинет" },
    WC5_F: { f: 5, x: 360, y: 380, label: "Санузел (Ж)" },
    WC5_M: { f: 5, x: 290, y: 130, label: "Санузел (М)" },
    STAIR5_1: { f: 5, x: 175, y: 230, label: "Лестница №1" },
    STAIR5_2: { f: 5, x: 375, y: 610, label: "Лестница №2" },
    STAIR5_3: { f: 5, x: 675, y: 610, label: "Лестница №3" },
    STAIR5_4: { f: 5, x: 175, y: 80, label: "Лестница №4" },
    "601": { f: 6, x: 240, y: 590, label: "601" },
    "602": { f: 6, x: 100, y: 480, label: "602" },
    "603": { f: 6, x: 100, y: 370, label: "603" },
    "606": { f: 6, x: 110, y: 710, label: "606" },
    "607": { f: 6, x: 240, y: 710, label: "607" },
    "610": { f: 6, x: 800, y: 710, label: "610" },
    "611": { f: 6, x: 910, y: 710, label: "611" },
    "612": { f: 6, x: 910, y: 540, label: "612" },
    "613": { f: 6, x: 910, y: 260, label: "613" },
    "616": { f: 6, x: 780, y: 370, label: "616" },
    "617": { f: 6, x: 780, y: 260, label: "617" },
    "618": { f: 6, x: 800, y: 590, label: "618" },
    WC6_F: { f: 6, x: 90, y: 280, label: "Санузел (Ж)" },
    WC6_M: { f: 6, x: 770, y: 180, label: "Санузел (М)" },
    STAIR6_1: { f: 6, x: 175, y: 430, label: "Лестница №1" },
    STAIR6_2: { f: 6, x: 375, y: 610, label: "Лестница №2" },
    STAIR6_3: { f: 6, x: 675, y: 610, label: "Лестница №3" },
    STAIR6_4: { f: 6, x: 765, y: 130, label: "Лестница №4" }
};

/* СВЯЗИ */
const EDGES = [
    ["START", "101"], ["START", "102"], ["102", "104"], ["104", "106"],
    ["106", "110"], ["110", "107"], ["107", "107A"], ["107A", "112"], ["112", "116"],
    ["101", "103"], ["103", "105"], ["105", "107"],
    ["101", "115"], ["115", "113"], ["113", "111"],
    ["111", "140"], ["140", "138"], ["138", "142"],
    ["142", "144"], ["144", "148"], ["148", "146"],
    ["101", "BUFFET"], ["BUFFET", "124"], ["124", "122"], ["122", "120"],
    ["120", "134"],
    ["134", "WC1_M"], ["WC1_M", "WC1_F2"],
    ["110", "WC1_F"],
    ["STAIR1_1", "134"], ["STAIR1_2", "107"], ["STAIR1_3", "103"], ["STAIR1_4", "146"],
    ["STAIR1_1", "STAIR2_1"], ["STAIR1_2", "STAIR2_2"], ["STAIR1_3", "STAIR2_3"],
    ["STAIR2_1", "STAIR3_1"], ["STAIR2_2", "STAIR3_2"], ["STAIR2_3", "STAIR3_3"],
    ["STAIR3_1", "STAIR4_1"], ["STAIR3_2", "STAIR4_2"], ["STAIR3_3", "STAIR4_3"],
    ["STAIR4_1", "STAIR5_1"], ["STAIR4_2", "STAIR5_2"], ["STAIR4_3", "STAIR5_3"],
    ["STAIR5_1", "STAIR6_1"], ["STAIR5_2", "STAIR6_2"], ["STAIR5_3", "STAIR6_3"],
    ["201", "202"], ["202", "204"], ["204", "206"], ["206", "208"], ["208", "210"], ["210", "212"],
    ["212", "224"], ["224", "222"], ["222", "220"], ["220", "218"],
    ["218", "226"], ["226", "230"], ["230", "232"], ["232", "234"], ["234", "236"],
    ["236", "238"], ["238", "242"], ["242", "244"], ["244", "246"], ["246", "250"], ["250", "252a"],
    ["252a", "256"], ["256", "258"], ["258", "260"],
    ["260", "221"], ["221", "219"], ["219", "217"],
    ["217", "201"],
    ["230", "WC2_F"], ["242", "WC2_M"],
    ["STAIR2_1", "226"], ["STAIR2_2", "221"], ["STAIR2_3", "217"],
    ["300", "302"], ["302", "304"], ["304", "306"], ["306", "308"], ["308", "310"], ["310", "312"],
    ["312", "318"], ["318", "320"], ["320", "322"], ["322", "324"],
    ["324", "326"], ["326", "330"], ["330", "332"], ["332", "334"], ["334", "336"],
    ["336", "338"], ["338", "340"], ["340", "342"], ["342", "346"], ["346", "348"],
    ["348", "350"], ["350", "356"], ["356", "358"], ["358", "360"],
    ["360", "362"], ["362", "364"], ["364", "329"], ["329", "325"], ["325", "358"],
    ["300", "307"], ["307", "309"], ["309", "311"], ["311", "313"], ["313", "315"], ["315", "317"],
    ["317", "326"],
    ["318", "WC3_F"], ["326", "WC3_F2"], ["342", "WC3_M"], ["350", "WC3_M2"],
    ["STAIR3_1", "318"], ["STAIR3_2", "307"], ["STAIR3_3", "329"], ["STAIR3_4", "346"],
    ["400", "401"], ["401", "403"], ["403", "404"], ["404", "406"],
    ["406", "412"], ["412", "414"], ["414", "416"], ["416", "418"], ["418", "420"],
    ["420", "409"], ["409", "407"], ["407", "405"], ["405", "403"],
    ["400", "417"], ["417", "434"], ["434", "432"],
    ["432", "430"], ["430", "426"], ["426", "424"], ["424", "422"],
    ["422", "411"], ["411", "RECTOR"], ["RECTOR", "417"],
    ["412", "WC4_M"], ["424", "WC4_M2"],
    ["STAIR4_1", "416"], ["STAIR4_2", "403"], ["STAIR4_3", "417"], ["STAIR4_4", "422"],
    ["501", "502"], ["502", "506"],
    ["506", "520"], ["520", "520A"], ["520A", "509"], ["509", "507"], ["507", "505"],
    ["505", "512"], ["512", "514"], ["514", "516"], ["516", "518"],
    ["518", "522"], ["522", "511"], ["511", "526"], ["526", "530"], ["530", "532"], ["532", "532A"],
    ["532A", "534"], ["534", "538"], ["538", "517"], ["517", "515"], ["515", "501"],
    ["512", "WC5_F"], ["526", "WC5_M"],
    ["STAIR5_1", "511"], ["STAIR5_2", "501"], ["STAIR5_3", "538"], ["STAIR5_4", "522"],
    ["601", "602"], ["602", "603"], ["603", "606"], ["606", "607"], ["607", "601"],
    ["610", "611"], ["611", "612"], ["612", "613"], ["613", "617"], ["617", "616"], ["616", "618"], ["618", "610"],
    ["603", "WC6_F"], ["613", "WC6_M"],
    ["STAIR6_1", "603"], ["STAIR6_2", "607"], ["STAIR6_3", "610"], ["STAIR6_4", "613"]
];

const ADJ = {};
for (const n in NODES) ADJ[n] = [];
EDGES.forEach(([a, b]) => { if (ADJ[a] && ADJ[b]) { ADJ[a].push(b); ADJ[b].push(a); } });

const DEST_MAP = {
    admission: "122", library: "115", cafe: "144", atrium: "101",
    wc: "WC1_F", pc: "208", dean: "DEAN", rector: "RECTOR",
    med: "MED", rooms: "101"
};

let state = { destKey: null, destNode: null, startNode: null, selectedRoom: null, route: [], steps: [], step: 0 };
let currentFloor = 1;

/* Глобальная функция для SVG */
window.selectRoom = function(roomId, floorNum) {
    const floor = floorNum || currentFloor;
    const nodeData = NODES[roomId];
    const label = nodeData?.label || roomId;
    
    state.selectedRoom = { node: roomId, label, floor };
    
    document.querySelectorAll(".room, .room-group").forEach(el => {
        el.style.fill = "";
        el.classList.remove("selected");
    });
    
    const el = document.getElementById("room-" + roomId);
    if (el) {
        const rect = el.querySelector(".room");
        if (rect) {
            rect.style.fill = "#e74c3c";
            setTimeout(() => { rect.style.fill = ""; }, 300);
        }
        el.classList.add("selected");
    }
    
    const bar = document.getElementById("selectionBar");
    const txt = document.getElementById("selectionText");
    if (bar && txt) {
        txt.textContent = `${label}, ${FLOOR_NAMES[floor]}`;
        bar.classList.remove("hidden");
    }
    setNovi(`Выбрано: ${label}. Нажмите "Маршрут"!`);
};

/* ЗАГРУЗКА ЭТАЖА */
function loadFloor(floorNumber) {
    currentFloor = floorNumber;
    document.querySelectorAll(".floor-btn").forEach(btn => {
        btn.classList.toggle("active", parseInt(btn.dataset.floor) === floorNumber);
    });
    
    const container = document.getElementById("floorMap");
    if (!container) return;
    
    fetch(`img/floor${floorNumber}.svg`)
        .then(r => r.ok ? r.text() : Promise.reject("Not found"))
        .then(svgText => {
            container.innerHTML = svgText;
            const svg = container.querySelector("svg");
            if (svg) {
                svg.setAttribute("width", "100%");
                svg.setAttribute("height", "auto");
                svg.style.display = "block";
            }
            setNovi(`Загружен ${floorNumber} этаж. Выберите комнату!`);
        })
        .catch(() => {
            if (FLOOR_SVGS[floorNumber]) {
                container.innerHTML = FLOOR_SVGS[floorNumber];
                const svg = container.querySelector("svg");
                if (svg) {
                    svg.setAttribute("width", "100%");
                    svg.setAttribute("height", "auto");
                    svg.style.display = "block";
                }
                setNovi(`Загружен ${floorNumber} этаж. Выберите комнату!`);
            } else {
                container.innerHTML = `<div style="padding:40px;text-align:center;color:#ef4444;">Карта ${floorNumber} этажа не найдена</div>`;
            }
        });
}

/* БЫСТРЫЙ ВЫБОР */
function selectStartPoint(nodeId, label, floor) {
    state.startNode = nodeId;
    const card = document.getElementById("startCard");
    const name = document.getElementById("startName");
    const fl = document.getElementById("startFloorInfo");
    if (card && name) {
        card.classList.remove("hidden");
        name.textContent = label;
        if (fl) fl.textContent = FLOOR_NAMES[floor];
    }
    setNovi(`Вы в: ${label}. Строю маршрут...`);
    if (state.destNode) setTimeout(() => buildRoute(nodeId, state.destNode), 300);
}

/* ПОСТРОЕНИЕ МАРШРУТА */
function buildRoute(start, goal) {
    const path = findPath(start, goal);
    if (!path.length) { setNovi("Маршрут не найден"); return; }
    
    state.route = path;
    state.steps = makeSteps(path);
    state.step = 0;
    
    const card = document.getElementById("startCard");
    const name = document.getElementById("startName");
    const fl = document.getElementById("startFloorInfo");
    if (card && name && !card.classList.contains("hidden")) {
        name.textContent = NODES[start]?.label || start;
        if (fl) fl.textContent = FLOOR_NAMES[NODES[start]?.f || 1];
    }
    
    document.getElementById("selectionBar")?.classList.add("hidden");
    document.getElementById("routePanel")?.classList.remove("hidden");
    
    drawRouteLine(path);
    showStep();
    renderRouteList();
    setNovi(`Маршрут до "${PLACES[state.destKey] || goal}" готов!`);
}

/* A* ПОИСК */
function findPath(start, goal) {
    if (!NODES[start] || !NODES[goal]) return [];
    const open = new Set([start]), came = {}, g = {}, f = {};
    for (const n in NODES) { g[n] = Infinity; f[n] = Infinity; }
    g[start] = 0; f[start] = dist(start, goal);
    
    let iter = 0;
    while (open.size && iter++ < 1000) {
        let cur = null, best = Infinity;
        open.forEach(n => { if (f[n] < best) { best = f[n]; cur = n; } });
        if (cur === goal) {
            const path = [cur];
            while (came[cur]) { cur = came[cur]; path.unshift(cur); }
            return path;
        }
        open.delete(cur);
        for (const nb of ADJ[cur] || []) {
            const tg = g[cur] + dist(cur, nb);
            if (tg < g[nb]) { came[nb] = cur; g[nb] = tg; f[nb] = tg + dist(nb, goal); open.add(nb); }
        }
    }
    return [];
}

function dist(a, b) {
    const na = NODES[a], nb = NODES[b];
    if (!na || !nb) return Infinity;
    return Math.hypot(na.x - nb.x, na.y - nb.y) + Math.abs(na.f - nb.f) * 1000;
}

/* ОТРИСОВКА */
function drawRouteLine(path) {
    const container = document.getElementById("floorMap");
    if (!container) return;
    let old = container.querySelector(".route-path");
    if (old) old.remove();
    
    const routePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    routePath.setAttribute("class", "route-path");
    let d = "";
    path.forEach((id, i) => {
        const n = NODES[id];
        if (!n) return;
        d += (i === 0 ? `M ${n.x} ${n.y}` : ` L ${n.x} ${n.y}`);
    });
    routePath.setAttribute("d", d);
    routePath.setAttribute("fill", "none");
    routePath.setAttribute("stroke", "#ef4444");
    routePath.setAttribute("stroke-width", "6");
    routePath.setAttribute("stroke-linecap", "round");
    
    const svg = container.querySelector("svg");
    if (svg) svg.appendChild(routePath);
    showMarkers(path);
}

function showMarkers(path) {
    const start = NODES[path[0]], finish = NODES[path[path.length-1]];
    if (!start || !finish) return;
    const container = document.getElementById("floorMap");
    if (!container) return;
    
    let oldStart = container.querySelector(".start-marker");
    let oldFinish = container.querySelector(".finish-marker");
    if (oldStart) oldStart.remove();
    if (oldFinish) oldFinish.remove();
    
    const startMarker = document.createElement("div");
    startMarker.className = "map-marker start-marker";
    startMarker.style.left = `${(start.x/1000)*100}%`;
    startMarker.style.top = `${(start.y/800)*100}%`;
    
    const finishMarker = document.createElement("div");
    finishMarker.className = "map-marker finish-marker";
    finishMarker.style.left = `${(finish.x/1000)*100}%`;
    finishMarker.style.top = `${(finish.y/800)*100}%`;
    
    container.appendChild(startMarker);
    container.appendChild(finishMarker);
}

function makeSteps(path) {
    const steps = [];
    for (let i = 0; i < path.length - 1; i++) {
        const a = NODES[path[i]], b = NODES[path[i+1]];
        let text = a.f !== b.f ? `↑ Поднимитесь на ${b.f} этаж` :
                   b.x > a.x + 50 ? "→ Идите направо" :
                   b.x < a.x - 50 ? "← Идите налево" :
                   b.y < a.y - 30 ? "↑ Идите вперёд" :
                   b.y > a.y + 30 ? "↓ Идите назад" : "Продолжайте";
        steps.push({ from: path[i], to: path[i+1], text });
    }
    return steps;
}

function showStep() {
    const txt = document.getElementById("routeStep");
    if (!txt) return;
    if (state.step >= state.steps.length) { showCompletionScreen(); return; }
    txt.textContent = `${state.step + 1}. ${state.steps[state.step].text}`;
}

function renderRouteList() {
    const list = document.getElementById("routeList");
    if (!list) return;
    let html = `<div class="route-item done"><span class="route-dot green"></span> Вы: ${NODES[state.startNode || state.selectedRoom?.node]?.label || "—"}</div>`;
    state.steps.forEach((s, i) => {
        const cls = i < state.step ? "done" : i === state.step ? "active" : "";
        html += `<div class="route-item ${cls}"><span class="route-dot ${cls}"></span> ${s.text}</div>`;
    });
    html += `<div class="route-item"><span class="route-dot yellow"></span> ${PLACES[state.destKey] || "Назначение"}</div>`;
    list.innerHTML = html;
}

function nextStep() {
    if (state.step < state.steps.length) { state.step++; showStep(); renderRouteList(); }
}

function showCompletionScreen() {
    const screen = document.getElementById("completionScreen");
    const place = document.getElementById("foundPlace");
    if (screen) {
        if (place) {
            const name = PLACES[state.destKey] || "место";
            const icon = PLACE_ICONS[state.destKey] || "📍";
            place.textContent = `${icon} ${name}`;
        }
        screen.classList.remove("hidden");
        document.getElementById("routePanel")?.classList.add("hidden");
        setNovi("Отличная работа! ");
    }
}

function clearSelection() {
    state.selectedRoom = null;
    document.querySelectorAll(".room, .room-group").forEach(r => { r.style.fill = ""; r.classList.remove("selected"); });
    document.getElementById("selectionBar")?.classList.add("hidden");
    setNovi("Нажми на кабинет — построю маршрут!");
}

function setNovi(text) {
    const el = document.getElementById("noviMessage");
    if (el) el.textContent = text;
}

window.selectStartPoint = selectStartPoint;
window.clearSelection = clearSelection;
window.buildRoute = buildRoute;

/* ИНИЦИАЛИЗАЦИЯ */
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const destKey = params.get("dest");
    const roomNumber = params.get("room");
    const roomNode = params.get("node");
    const roomFloor = params.get("floor");
    
    if (roomNumber && roomNode) {
        const floor = parseInt(roomFloor) || 1;
        if (!NODES[roomNode]) {
            NODES[roomNode] = { f: floor, x: 500, y: 400, label: `Аудитория ${roomNumber}` };
        }
        state.destKey = "rooms";
        state.destNode = roomNode;
        document.getElementById("breadcrumbDest").textContent = `Аудитория ${roomNumber}`;
        document.getElementById("destName").textContent = `Аудитория ${roomNumber}`;
        document.getElementById("destFloorInfo").textContent = FLOOR_NAMES[floor];
        document.getElementById("destIcon").textContent = "";
        setNovi(`Ищем аудиторию ${roomNumber} (${FLOOR_NAMES[floor]}). Выберите где вы!`);
    }
    else if (destKey && DEST_MAP[destKey]) {
        state.destKey = destKey;
        state.destNode = DEST_MAP[destKey];
        const name = PLACES[destKey];
        const floor = NODES[state.destNode]?.f || 1;
        document.getElementById("breadcrumbDest").textContent = name;
        document.getElementById("destName").textContent = name;
        document.getElementById("destFloorInfo").textContent = FLOOR_NAMES[floor];
        document.getElementById("destIcon").textContent = PLACE_ICONS[destKey] || "";
        setNovi(`Вам нужно в "${name}" (${FLOOR_NAMES[floor]}). Выберите где вы!`);
    }
    
    document.querySelectorAll(".floor-btn").forEach(btn => {
        btn.addEventListener("click", () => loadFloor(parseInt(btn.dataset.floor)));
    });
    
    document.getElementById("buildRouteBtn")?.addEventListener("click", () => {
        if (state.selectedRoom && state.destNode) buildRoute(state.selectedRoom.node, state.destNode);
    });
    
    document.getElementById("completeStep")?.addEventListener("click", nextStep);
    document.getElementById("rebuildRoute")?.addEventListener("click", () => {
        if (state.startNode && state.destNode) buildRoute(state.startNode, state.destNode);
    });
    
    document.getElementById("changeStart")?.addEventListener("click", () => {
        document.getElementById("startCard")?.classList.add("hidden");
        document.getElementById("routePanel")?.classList.add("hidden");
        const old = document.querySelector(".route-path");
        if (old) old.remove();
        document.getElementById("startMarker")?.remove();
        document.getElementById("finishMarker")?.remove();
        state.selectedRoom = null; state.startNode = null; state.route = []; state.steps = []; state.step = 0;
        document.querySelectorAll(".room, .room-group").forEach(r => { r.style.fill = ""; r.classList.remove("selected"); });
        setNovi("Нажми на кабинет — построю маршрут!");
    });
    
    document.getElementById("findAnotherBtn")?.addEventListener("click", () => {
        document.getElementById("completionScreen")?.classList.add("hidden");
        state.selectedRoom = null; state.startNode = null; state.route = []; state.steps = []; state.step = 0;
        const old = document.querySelector(".route-path");
        if (old) old.remove();
        document.getElementById("startMarker")?.remove();
        document.getElementById("finishMarker")?.remove();
        document.querySelectorAll(".room, .room-group").forEach(r => { r.style.fill = ""; r.classList.remove("selected"); });
        document.getElementById("selectionBar")?.classList.remove("hidden");
        setNovi("Нажми на кабинет — построю новый маршрут!");
    });
    
    setTimeout(() => loadFloor(1), 100);
});
