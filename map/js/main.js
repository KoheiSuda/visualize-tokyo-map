// main.js

import { getData, createMap } from "./map.js";
import { genre, shopData } from "./genre.js";

const main = async () => {
    const { topojsonData, stores, stations } = await getData();
    createMap(topojsonData, stores, stations, shopData);
};

main();
