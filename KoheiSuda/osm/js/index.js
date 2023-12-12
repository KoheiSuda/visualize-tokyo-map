const getData = async () => {
    // 日本地図のデータを読み込む
    const japanJson = await d3.json("./data/tokyo.topojson");
    const topojsonData = topojson.feature(japanJson, japanJson.objects.tokyo);

    return topojsonData;
};

function style(feature) {
    return {
        fillColor: "none", // 中身の塗りつぶしをなしに
        weight: 2, // 境界線の太さ
        opacity: 1, // 境界線の不透明度
        color: "red", // 境界線の色
        fillOpacity: 0, // 塗りつぶしの不透明度を0に（塗りつぶしなし）
        dashArray: "5, 5", // 点線のパターン（点の長さ、間隔の長さ）
    };
}

function createMap(topojsonData) {
    // 制限された範囲を定義
    var southWest = L.latLng(35.5, 138.9);
    var northEast = L.latLng(35.9, 140);
    var bounds = L.latLngBounds(southWest, northEast);

    // 地図を表示する要素と初期表示する緯度経度、ズームレベルを設定
    var map = L.map("map", {
        maxBounds: bounds, // 地図のビューを制限する
        maxBoundsViscosity: 1.0, // 地図のビューの外にスクロールしにくくする
        minZoom: 10, // 地図を縮小できる最小ズームレベル
    }).setView([35.6895, 139.6917], 10);

    // OpenStreetMapのタイルレイヤーを追加
    L.tileLayer("http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© Gravitystorm",
    }).addTo(map);

    // GeoJSON データを地図に追加
    L.geoJson(topojsonData, { style: style }).addTo(map);
}

const main = async () => {
    const topojsonData = await getData();
    createMap(topojsonData);
};

main();
