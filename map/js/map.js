import { mapping_stations } from "./station.js";
import { sliderclock } from "./clock.js";
import { genre } from "./genre.js";

export const mapping_stores = (stores, g, projection, choice_genres) => {
    const filteredStores = stores.filter((store) => choice_genres[store.genre]);

    g.selectAll("circle.store")
        .data(filteredStores)
        .join("circle")
        .attr("cx", (d) => projection([+d.Longitude, +d.Latitude])[0])
        .attr("cy", (d) => projection([+d.Longitude, +d.Latitude])[1])
        .attr("r", 1) // 点の半径
        .attr("fill", "rgba(255, 255, 0, 1)"); // 点の色
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
    mapping_stations(stations, station_lines, g, projection);

    // 地図上に点をプロットする
    mapping_stores(stores, g, projection, {});

    sliderclock(g);
    genre(g);
};

export { createMap };
