import { mapping_stations } from "./station.js";
import { sliderclock } from "./clock.js";
import { genre, shopData } from "./genre.js";
import { stores } from "./main.js";

let g;
let projection;

// Create a color mapping function
const colorScale = d3
    .scaleOrdinal()
    .domain(shopData[0].genre)
    .range(shopData[0].color);

const mapping_stores = (stores, g, projection, choice_genres) => {
    const filteredStores = stores.filter((store) => choice_genres[store.genre]);

    const circles = g
        .selectAll("circle.store")
        .data(filteredStores, (d) => d.id); // Assuming each store has a unique 'id' property

    circles
        .enter()
        .append("circle")
        .attr("class", "store")
        .attr("cx", (d) => projection([+d.Longitude, +d.Latitude])[0])
        .attr("cy", (d) => projection([+d.Longitude, +d.Latitude])[1])
        .attr("r", 1) // 点の半径
        .attr("opacity", 1) // 点の透明度
        .attr("fill", (d) => colorScale(d.genre)) // 点の色
        .merge(circles); // For updating existing circles if needed

    circles.exit().remove(); // Remove circles that are no longer in the data
};

const createMap = (topojsonData, stores, stations, station_lines, shopData) => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    const svg = d3
        .select("#map")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: 900px;"); // 900にしてるの適当すぎるかも

    projection = d3
        .geoMercator()
        .center([139.4917, 35.6895])
        .translate([width / 2, height / 2])
        .scale(80000);

    const path = d3.geoPath().projection(projection);

    g = svg.append("g");

    const map_color = "#444";

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
            d3.select(this).attr("fill", "red");
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", map_color);
        });

    states.append("title").text((d) => d.properties.nam_ja);

    // 駅を表示する
    mapping_stations(stations, station_lines, g, projection);

    // 地図上に点をプロットする
    mapping_stores(stores, g, projection, {});

    sliderclock(g);
    genre(g);

    // zoomイベントハンドラを作成
    const zoomed = (event) => {
        g.attr("transform", event.transform);
    };
    // zoom機能を初期化
    const zoom = d3.zoom().on("zoom", zoomed);
    // SVG要素にzoomイベントハンドラを適用
    svg.call(zoom);
};

export { createMap, stores, mapping_stores, g, projection };
