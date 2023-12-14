// main.js

import { getData } from "./map.js";
import { createMap } from "./map.js";

const main = async () => {
    const { topojsonData, stores, stations, station_lines } = await getData();
    createMap(topojsonData, stores, stations, station_lines);
};

main();
