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

    var map = new google.maps.Map(mapDiv, {
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
                featureType: "water",
                elementType: "geometry",
                stylers: [{ visibility: "on" }],
            },
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
        // オーバーレイ設定
        var layer = d3
            .select(this.getPanes().overlayLayer)
            .append("div")
            .attr("class", "SvgOverlay");
        //.style("position", "absolute")
        //.style("top", "0px")
        //.style("left", "0px");

        // SVG要素を作成
        this.svg = layer.append("svg");

        var markerOverlay = this;
        var overlayProjection = markerOverlay.getProjection();

        // Google Projection作成
        var googleMapProjection = d3.geoTransform({
            point: function (x, y) {
                d = new google.maps.LatLng(y, x); //引数で渡された緯度経度(x,y)をGoogle Maps API のLatLngオブジェクトに変換
                d = overlayProjection.fromLatLngToDivPixel(d); //LatLngオブジェクトから画面上の座標(ピクセル)を取得
                this.stream.point(d.x, d.y); //取得したピクセル座標を、geo streamとして渡す。
            },
        });

        // パスジェネレーター作成
        this.path = d3.geoPath().projection(googleMapProjection);
    };

    overlay.draw = function () {
        // mapDivの現在のサイズを取得
        var width = mapDiv.offsetWidth;
        var height = mapDiv.offsetHeight;

        // SVG要素のサイズを設定
        this.svg
            .attr("width", width)
            .attr("height", height)
            .style("position", "absolute")
            .style("top", "0px")
            .style("left", "0px");

        // 地図描く
        this.svg
            .selectAll("path")
            .data(topojsonData.features)
            .join("path")
            .attr("d", this.path)
            .attr("stroke", "#333") // 境界線の色
            .attr("stroke-width", 1) // 境界線の幅
            .attr("fill", "none"); // 中を塗りつぶさない
    };

    //作成したSVGを地図にオーバーレイする
    overlay.setMap(map);
}

const main = async () => {
    const topojsonData = await getData();
    createMap(topojsonData);
};

main();
