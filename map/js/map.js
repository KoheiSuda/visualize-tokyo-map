import { sliderclock } from "./clock.js";

const getData = async () => {
    // 日本地図のデータを読み込む
    const japanJson = await d3.json("./data/tokyo.topojson");
    const stations = await d3.csv("./data/train_data_with_coordinates.csv");

    // 店舗データを読み込む
    const stores = await d3.csv("./data/ramen_updated.csv");
    const topojsonData = topojson.feature(japanJson, japanJson.objects.tokyo);

    return { topojsonData, stores, stations };
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

    const states = g
        .append("g")
        .attr("fill", "#777")
        .attr("opacity", 0.5)
        .attr("cursor", "pointer")
        .selectAll("path")
        .data(topojsonData.features)
        .join("path")
        .attr("d", path);

    states.append("title").text((d) => d.properties.nam_ja);

    // 地図上に点をプロットする
    g.selectAll("circle")
        .data(stores)
        .join("circle")
        .attr("cx", (d) => projection([+d.Latitude, +d.Longitude])[0])
        .attr("cy", (d) => projection([+d.Latitude, +d.Longitude])[1])
        .attr("r", 3) // 点の半径
        .attr("fill", "rgba(255, 255, 0, 0.2)"); // 点の色

    sliderclock(g);
};

export { getData };
export { createMap };
