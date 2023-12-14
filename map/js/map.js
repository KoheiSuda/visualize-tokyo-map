import { sliderclock } from "./clock.js";
import { genre } from "./genre.js";

const getData = async () => {
    // 日本地図のデータを読み込む
    const japanJson = await d3.json("./data/tokyo.topojson");
    const stations = await d3.csv("./data/tokyo_station.csv");

    // 店舗データを読み込む
    const stores = await d3.csv("./data/ramen_updated.csv");
    const topojsonData = topojson.feature(japanJson, japanJson.objects.tokyo);

    return { topojsonData, stores, stations };
};

const mapping_stations = (stations, g, projection) => {
    g.selectAll("circle.station")
        .data(stations)
        .join("circle")
        .attr("cx", (d) => projection([+d.lon, +d.lat])[0])
        .attr("cy", (d) => projection([+d.lon, +d.lat])[1])
        .attr("r", 3) // Adjust the radius as needed
        .attr("fill", "blue"); // Choose a color that stands out
};

const mapping_stores = (stores, g, projection) => {
    g.selectAll("circle.store")
        .data(stores)
        .join("circle")
        .attr("class", "store") // クラス名を追加
        .attr("cx", (d) => projection([+d.Longitude, +d.Latitude])[0])
        .attr("cy", (d) => projection([+d.Longitude, +d.Latitude])[1])
        .attr("r", 1) // 点の半径
        .attr("fill", "rgba(255, 255, 0, 1)"); // 点の色
};

const createMap = (topojsonData, stores, stations) => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    const svg = d3
        .select("#map")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;");

    const projection = d3
        .geoMercator()
        .center([139.4917, 35.6895])
        .translate([width / 2, height / 2])
        .scale(80000);

    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");

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

    // 駅をプロットする
    mapping_stations(stations, g, projection);

    // 地図上に点をプロットする
    mapping_stores(stores, g, projection);

    sliderclock(g);
    genre(g);
};

export { getData };
export { createMap };
