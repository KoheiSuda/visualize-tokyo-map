import { shopData } from "./shopData.js";

// Create a color mapping function
const colorScale = d3
    .scaleOrdinal()
    .domain(shopData[0].genre)
    .range(shopData[0].color);

const mapping_stores_detail = (stores, g, projection, choice_genres, map) => {
    const filteredStores = stores.filter((store) => choice_genres[store.genre]);
    const circles = g
        .selectAll("circle.store")
        .data(filteredStores, (d) => d.id); // Assuming each store has a unique 'id' property
    circles
        .enter()
        .append("circle")
        .attr("class", "store")
        .attr("cx", (d) => {
            const point = map.latLngToLayerPoint(new L.LatLng(d.Latitude, d.Longitude));
            //console.log(`cx for id ${d.id}: ${point.x}`);
            return point.x;
        })
        .attr("cy", (d) => {
            const point = map.latLngToLayerPoint(new L.LatLng(d.Latitude, d.Longitude));
            //console.log(`cy for id ${d.id}: ${point.y}`);
            return point.y;
        })
        .attr("r", 5) // 点の半径
        .attr("fill-opacity", 1) // 点の透明度
        .attr("fill", (d) => colorScale(d.genre)) // 点の色
        
        .merge(circles); // For updating existing circles if needed

    circles.exit().remove(); // Remove circles that are no longer in the data
};
export { mapping_stores_detail };