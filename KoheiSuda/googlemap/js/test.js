//d3.json("gunma.geojson", function (geoData) {
//    main(geoData);
//});

const getData = async () => {
    // 日本地図のデータを読み込む
    const japanJson = await d3.json("./data/tokyo.topojson");
    const topojsonData = topojson.feature(japanJson, japanJson.objects.tokyo);

    return topojsonData;
};

function createMap(geoData) {
    //表示する地図の最大空間範囲と地図スクロール範囲？
    var extent = [-20037508.34, -20037508.34, 20037508.34, 20037508.34];

    var map = new OpenLayers.Map("map", {
        numZoomLevels: 20,
        //      projection: new OpenLayers.Projection("EPSG:900913"), // 地図の投影(真球メルカトル投影)
        projection: new OpenLayers.Projection("EPSG:3857"), // 地図の投影(真球メルカトル投影)
        displayProjection: new OpenLayers.Projection("EPSG: 4326"), // 等経緯度投影を定義
        maxExtent: extent, //最大の空間範囲
        restrictedExtent: extent, //地図スクロール範囲
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.Zoom(),
            new OpenLayers.Control.ScaleLine(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.MousePosition(),
            new OpenLayers.Control.KeyboardDefaults(),
        ],
    });

    //open streat map レイヤを指定
    var ol_wms = new OpenLayers.Layer.OSM();

    //OpenStreetMapレイヤーを追加
    map.addLayers([ol_wms]);

    //初期位置指定
    map.setCenter(
        new OpenLayers.LonLat(139.0032936, 36.3219088).transform(
            "EPSG:4326",
            "EPSG:900913"
        ),
        8
    );

    //svgを表示するオーバーレイオブジェクトを作成
    var overlay = new OpenLayers.Layer.Vector("states");

    // 地図にオーバーレイを追加する際のコンテナを作成
    overlay.afterAdd = function () {
        //ベクターレイヤーのdivエレメントを取得
        var div = d3.selectAll("#" + overlay.div.id);
        //既存のsvgレイヤを削除して新たなsvg要素を追加
        div.selectAll("svg").remove();
        var svg = div.append("svg");

        g = svg.append("g");

        //地図の左下と右上の緯度経度取得
        var bounds = d3.geo.bounds(geoData);

        //緯度経度->パスジェネレーター関数作成
        var path = d3.geo.path().projection(project);

        //geojsonデータからpathを作成
        var feature = g
            .selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path");

        //MapにMove Event登録
        map.events.register("moveend", map, update);

        update();

        function update() {
            var bottomLeft = project(bounds[0]); //地図左下緯度経度→ピクセル
            var topRight = project(bounds[1]); //地図右上緯度経度→ピクセル
            console.log(topRight);

            //svgのサイズを更新
            svg.attr("width", topRight[0] - bottomLeft[0])
                .attr("height", bottomLeft[1] - topRight[1])
                .style("margin-left", bottomLeft[0] + "px")
                .style("margin-top", topRight[1] + "px");

            g.attr(
                "transform",
                "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")"
            );

            //描画したsvgのアップデート
            feature.attr("d", path);
        }

        //位置情報→ピクセル変換
        function project(x) {
            var point = map.getViewPortPxFromLonLat(
                new OpenLayers.LonLat(x[0], x[1]).transform(
                    "EPSG:4326",
                    "EPSG:900913"
                )
            );
            return [point.x, point.y];
        }
    };

    map.addLayer(overlay);
}

const main = async () => {
    const topojsonData = await getData();
    createMap(topojsonData);
};

main();
