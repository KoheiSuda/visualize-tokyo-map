const getData = async () => {
    // 日本地図のデータを読み込む
    const japanJson = await d3.json("./data/tokyo.topojson");
    const topojsonData = topojson.feature(japanJson, japanJson.objects.tokyo);

    return topojsonData;
};

function createMap(topojsonData) {
    var extent = {
        north: 35.9,
        south: 35.5,
        east: 140,
        west: 138.9,
    };
    // OSMとLeafletでのマップの初期化
    var map = L.map("map").setView([35.6895, 139.6917], 8);

    // OpenStreetMapのタイルレイヤーを追加
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // マップのスタイルを設定する関数（簡易版）
    function setMapStyles(zoomLevel) {
        // LeafletではCSSを使用してスタイルを変更する
        // 例: 駅のラベルの表示/非表示を切り替える
        // ここでは具体的な実装は省略しますが、CSSクラスを動的に切り替えることで実現可能
    }

    // ズームレベルが変更された時のイベントリスナー
    map.on("zoomend", function () {
        setMapStyles(map.getZoom());
    });

    // 主要駅の座標
    var stations = [
        { lat: 35.681236, lng: 139.767125, name: "東京" },
        { lat: 35.690921, lng: 139.700258, name: "新宿" },
        { lat: 35.658581, lng: 139.745433, name: "渋谷" },
        // 他の駅も同様に追加
    ];

    // 各駅にマーカーを設置
    stations.forEach(function (station) {
        L.marker([station.lat, station.lng]).addTo(map).bindPopup(station.name);
    });
}

const main = async () => {
    const topojsonData = await getData();
    createMap(topojsonData);
};

main();
