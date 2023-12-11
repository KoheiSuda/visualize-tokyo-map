const getData = async () => {
    // 日本地図のデータを読み込む
    const japanJson = await d3.json("./data/tokyo.topojson");
    const topojsonData = topojson.feature(japanJson, japanJson.objects.tokyo);

    return topojsonData;
};

function createMap(topojsonData) {
    var mapDiv = document.getElementById("map");

    var tokyoBounds = {
        north: 35.9,
        south: 35.5,
        east: 140,
        west: 138.9,
    };

    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: { lat: 35.6895, lng: 139.6917 },
        restriction: {
            latLngBounds: tokyoBounds,
            strictBounds: true,
        },
    });

    function setMapStyles(zoomLevel) {
        var stationLabelVisibility = zoomLevel >= 14 ? "on" : "off";
        var styles = [
            { featureType: "all", stylers: [{ visibility: "off" }] },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ visibility: "on" }],
            },
            {
                featureType: "transit.station",
                elementType: "labels.icon",
                stylers: [{ visibility: "on" }],
            },
            {
                featureType: "transit.station",
                elementType: "labels.text",
                stylers: [{ visibility: stationLabelVisibility }],
            },
            {
                featureType: "road",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "road.highway",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
        ];
        map.setOptions({ styles: styles });
    }

    setMapStyles(map.getZoom());

    map.addListener("zoom_changed", function () {
        setMapStyles(map.getZoom());
    });

    // 主要駅の座標
    var stations = [
        { lat: 35.681236, lng: 139.767125, name: "東京" }, // 東京駅
        { lat: 35.690921, lng: 139.700258, name: "新宿" }, // 新宿駅
        { lat: 35.658581, lng: 139.745433, name: "渋谷" }, // 渋谷駅
        // 他の駅も同様に追加
    ];

    // 各駅にマーカーを設置
    stations.forEach(function (station) {
        new google.maps.Marker({
            position: { lat: station.lat, lng: station.lng },
            map: map,
            title: station.name,
        });
    });

    // D3でのカスタムオーバーレイの作成
    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function () {
        var layer = d3
            .select(this.getPanes().overlayLayer)
            .append("div")
            .attr("class", "stations");

        // 地図の変更を監視
        overlay.draw = function () {
            var projection = d3
                .geoMercator()
                .fitSize(
                    [mapDiv.offsetWidth, mapDiv.offsetHeight],
                    topojsonData
                );
            var path = d3.geoPath().projection(projection);

            // SVG要素を追加または取得
            var container = d3
                .select(this.getPanes().overlayLayer)
                .append("div")
                .attr("class", "stations")
                .style("position", "absolute")
                .style("top", "0px")
                .style("left", "0px")
                .append("svg");

            // 地図の描画
            container
                .selectAll("path")
                .data(topojsonData.features)
                .join("path")
                .attr("d", path)
                .attr("fill", "#444");
        };
    };

    overlay.setMap(map);
}

const main = async () => {
    const topojsonData = await getData();
    createMap(topojsonData);
};

main();
