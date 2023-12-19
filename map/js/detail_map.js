import { mapping_stores_detail } from "./mapping_stores_detail.js";
import { projection } from "./projection.js";
import { choice_genres } from "./genre.js";

let detailMap
let gd

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

function detail_map(click_lon, click_lat, stores) {
    // 既存の地図コンテナを取得または新しく作成
    let mapContainer = document.getElementById("map");
    if (!mapContainer) {
        mapContainer = document.createElement("div");
        mapContainer.id = "map";
        mapContainer.style.height = "60px"; // 地図の高さを設定
        mapContainer.style.width = "80px"; // 地図の幅を設定
        document.body.appendChild(mapContainer); // bodyまたは別の適切な要素に追加
    } else {
        // 既存の地図インスタンスを削除
        mapContainer.innerHTML = "";
    }

    // 新しい地図インスタンスを初期化
    detailMap = L.map("map").setView([click_lat, click_lon], 15);

    // OSMタイルレイヤーを追加
    L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
        maxZoom: 19,
    }).addTo(detailMap);

    // Leaflet に SVG レイヤーを追加
    var svgLayer = L.svg().addTo(detailMap);

    // D3.js で SVG レイヤーを選択
    var svg = d3.select("#map").select("svg");

    gd = svg.append("g")

    // zoomイベントハンドラを作成
    const zoomed = (event) => {
        g.attr("transform", event.transform);
    };

    // zoom機能を初期化
    const zoom = d3
        .zoom()
        .scaleExtent([1, 8])
        .translateExtent([
            [0, 0],
            [width, height],
        ])
        .on("zoom", zoomed);

    // SVG要素にzoomイベントハンドラを適用
    svg.call(zoom);
    mapping_stores_detail(stores, gd, projection, choice_genres, detailMap);
    // マップがズームまたはドラッグされたときに発生するイベントをリッスン
    detailMap.on('moveend', function() {
        console.log(choice_genres);
        mapping_stores_detail(stores, gd, projection, choice_genres, detailMap);
    });
    // ボタンを追加
    addBackToD3MapButton(detailMap);
}

export { detail_map, detailMap, gd };