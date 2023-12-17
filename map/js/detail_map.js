function detail_map(click_lon, click_lat) {
    // 既存の地図インスタンスが存在するか確認
    let existingMap = document.getElementById("detailMap");

    // 既存の地図インスタンスを削除（存在する場合）
    if (existingMap) {
        existingMap.remove();
    }

    // 新しい地図コンテナを作成
    let mapContainer = document.createElement("div");
    mapContainer.id = "detailMap";
    mapContainer.style.height = "400px"; // 地図の高さを設定
    document.getElementById("clock").appendChild(mapContainer);

    // 新しい地図インスタンスを初期化
    let detailMap = L.map("detailMap").setView([click_lat, click_lon], 10);

    // OSMタイルレイヤーを追加
    L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
        maxZoom: 19,
    }).addTo(detailMap);
}

export { detail_map };
