const getData = async () => {
    // 日本地図のデータを読み込む
    const japanJson = await d3.json("./data/tokyo.topojson");
    const stations = await d3.csv("./data/train_data_with_coordinates.csv");

    // 店舗データを読み込む
    const stores = await d3.csv("./data/converted_donki_data.csv");
    const topojsonData = topojson.feature(japanJson, japanJson.objects.tokyo);

    return { topojsonData, stores, stations };
};

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

    // 地図の全体を覆う大きな矩形を定義
    var outerBounds = [
        [-90, -180],
        [90, 180],
    ]; // 緯度と経度の最大範囲

    // 大きな矩形のスタイルを設定
    var outerStyle = {
        fillColor: "white", // 白色で塗りつぶし
        fillOpacity: 0.9, // 不透明度
        stroke: false, // 境界線なし
    };

    // 枠線レイヤーを作成
    var borderLayer = L.geoJson(topojsonData, {
        fill: false,
        weight: 1,
        color: "black",
        fillOpacity: 0,
    });

    // 大きな矩形を地図に追加（変数で参照可能にする）
    var largeRect = L.rectangle(outerBounds, outerStyle).addTo(map);

    // 枠線を描画
    L.geoJson(topojsonData, {
        // 境界線のスタイル設定
        style: function (feature) {
            return {
                weight: 1,
                color: "black",
                fillOpacity: 0,
            };
        },
        // 境界線にクリックイベントハンドラを追加
        onEachFeature: function (feature, layer) {
            layer.on("click", function () {
                // クリックされた市区町村の領域にズーム
                map.fitBounds(layer.getBounds());
                // 白い覆いを地図から削除
                //if (largeRect) {
                //    largeRect.remove();
                //}
            });
        },
    }).addTo(map);

    // 枠線を地図に追加
    borderLayer.addTo(map);

    // ズームレベルに基づいて大きな矩形を表示/非表示し、
    // 境界線レイヤーを再配置する関数
    function toggleLargeRectAndRedrawBorder() {
        var thresholdZoom = 14;
        var currentZoom = map.getZoom();

        //if (currentZoom > thresholdZoom) {
        //    largeRect.remove();
        //} else {
        //    largeRect.addTo(map);
        //}

        // 境界線レイヤーを再配置
        borderLayer.remove();
        borderLayer.addTo(map);
    }

    // zoomend イベントに関数をバインド
    map.on("zoomend", toggleLargeRectAndRedrawBorder);

    // 初期状態の設定
    toggleLargeRectAndRedrawBorder(); // ズームレベルに基づいて大きな矩形を表示/非表示し、
    // 境界線レイヤーを再配置する関数
    function toggleLargeRectAndRedrawBorder() {
        var thresholdZoom = 12;
        var currentZoom = map.getZoom();

        if (currentZoom > thresholdZoom) {
            largeRect.remove();
        } else {
            largeRect.addTo(map);
        }

        // 境界線レイヤーを再配置
        borderLayer.remove();
        borderLayer.addTo(map);
    }

    // zoomend イベントに関数をバインド
    map.on("zoomend", toggleLargeRectAndRedrawBorder);

    // 初期状態の設定
    toggleLargeRectAndRedrawBorder();
}

const main = async () => {
    const { topojsonData, stores, stations } = await getData();
    createMap(topojsonData);
};
main();
