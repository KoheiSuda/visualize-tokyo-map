// main.js

import { createMap } from "./map.js";

let stores;
const getData = async () => {
    // 日本地図のデータを読み込む
    const japanJson = await d3.json("./data/tokyo.topojson");
    const stations = await d3.csv("./data/tokyo_station.csv");
    const station_lines = await d3.csv("./data/tokyo_join.csv");

    // 店舗データを読み込む
    const ramen = await d3.csv("./data/ramen_updated.csv");
    const izakaya = await d3.csv("./data/izakaya_updated.csv");
    const cafe = await d3.csv("./data/cafe_updated.csv");
    const gas = await d3.csv("./data/gas_updated.csv");

    // 店舗データを結合する
    stores = ramen.concat(izakaya).concat(cafe).concat(gas);

    const topojsonData = topojson.feature(japanJson, japanJson.objects.tokyo);

    return { topojsonData, stores, stations, station_lines };
};

const main = async () => {
    const { topojsonData, stores, stations, station_lines } = await getData();
    createMap(topojsonData, stores, stations, station_lines, shopData);
};

main();

export { stores };
