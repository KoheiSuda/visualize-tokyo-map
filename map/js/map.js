import { mapping_stations } from "./station.js";
import { genre } from "./genre.js";
import { stores } from "./main.js";
import { detail_map } from "./detail_map.js";
import { width, height, projection } from "./projection.js";
import { createGraph } from "./graph.js";

let g;

const createMap = (topojsonData, stores, stations, station_lines, shopData) => {
    projection;
    const svg = d3
        .select("#map")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: ${window.innerHeight}px;")
        .attr("stroke", "gray") // 枠線の色を黒に設定
        .attr("stroke-width", "1"); // 枠線の幅を2に設定

    const path = d3.geoPath().projection(projection);

    g = svg.append("g");

    const map_color = "#ffffff"; //"#e6e6fa";
    let click_lat = -1; // 緯度
    let click_lon = -1; // 経度

    // ツールチップ要素を作成
    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip") // CSSでスタイリング可能なクラス名
        .style("opacity", 0);

    const states = g
        .append("g")
        .attr("fill", map_color)
        .attr("opacity", 0.5)
        .attr("cursor", "pointer")
        .selectAll("path")
        .data(topojsonData.features)
        .join("path")
        .attr("d", path)
        .on("mouseover", function (event, d) {
            //console.log("mouseover");
            d3.select(this).attr("fill", "red");
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
                .html(d.properties.ward_ja)
                .style("left", event.pageX + "px") // カーソルの右側に表示
                .style("top", event.pageY - 28 + "px"); // カーソルの下側に表示
            createGraph(d.properties.ward_ja, 0, 0);
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", map_color);
            tooltip.transition().duration(500).style("opacity", 0);
            d3.select("#graph").select("svg").remove(); // グラフを消す
        })
        .on("dblclick", function (event) {
            tooltip.transition().duration(500).style("opacity", 0);
            const [x, y] = d3.pointer(event); // クリックされた地点のスクリーン座標
            const coords = projection.invert([x, y]); // 地理座標に変換
            click_lon = coords[0]; // 経度
            click_lat = coords[1]; // 緯度
            console.log("Latitude:", click_lat, "Longitude:", click_lon); // 緯度と経度をコンソールに表示
            detail_map(click_lon, click_lat, stores);
        });
    states.append("title").text((d) => d.properties.nam_ja);

    // 駅を表示する
    mapping_stations(stations, station_lines, g, projection);

    genre();

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
};

export { createMap, stores, g, projection };
