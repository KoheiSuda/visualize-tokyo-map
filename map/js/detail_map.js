import { genre } from "./genre.js";
import { mapping_stores } from "./mapping_stores.js";
import { projection } from "./projection.js";

// Leaflet マップにカスタムコントロールとしてボタンを追加する関数
function addBackToD3MapButton(map) {
    var customControl = L.Control.extend({
        options: {
            position: "topright", // ボタンの位置
        },
        onAdd: function () {
            var container = L.DomUtil.create(
                "button",
                "leaflet-bar leaflet-control leaflet-control-custom"
            );
            container.style.backgroundColor = "white";
            container.style.width = "100px";
            container.style.height = "30px";
            container.innerHTML = "Back to D3";
            container.style.textAlign = "center";
            container.style.lineHeight = "30px";

            container.onclick = function () {
                switchToD3Map();
            };

            return container;
        },
    });

    map.addControl(new customControl());
}

// D3 マップに戻る関数
function switchToD3Map() {
    // Leaflet マップを削除
    let mapContainer = document.getElementById("map");
    if (mapContainer) {
        mapContainer.remove();
    }

    // 現在のページをリロードする（改善の余地あり）
    window.location.reload();
}

function detail_map(click_lon, click_lat, stores, choice_genres) {
    // 既存の地図コンテナを取得または新しく作成
    let mapContainer = document.getElementById("map");
    if (!mapContainer) {
        mapContainer = document.createElement("div");
        mapContainer.id = "map";
        mapContainer.style.height = "400px"; // 地図の高さを設定
        document.body.appendChild(mapContainer); // bodyまたは別の適切な要素に追加
    } else {
        // 既存の地図インスタンスを削除
        mapContainer.innerHTML = "";
    }

    // 新しい地図インスタンスを初期化
    let detailMap = L.map("map").setView([click_lat, click_lon], 15);

    // OSMタイルレイヤーを追加
    L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
        maxZoom: 19,
    }).addTo(detailMap);

    // Leaflet に SVG レイヤーを追加
    var svgLayer = L.svg().addTo(detailMap);

    // D3.js で SVG レイヤーを選択
    var svg = d3.select("#map").select("svg");

    projection;

    var g = svg.append("g");
    
    genre(g);

    // ボタンを追加
    addBackToD3MapButton(detailMap);
}

export { detail_map };
