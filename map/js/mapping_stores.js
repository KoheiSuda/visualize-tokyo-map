import { shopData } from "./shopData.js";

// Create a color mapping function
console.log(shopData);
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
        .attr("r", 8) // 点の半径
        .attr("opacity", 0.1) // 点の透明度
        .attr("fill", (d) => colorScale(d.genre)) // 点の色
        .style("pointer-events", "none") // ポインターイベントを無視させる
        .merge(circles); // For updating existing circles if needed

    circles.exit().remove(); // Remove circles that are no longer in the data
};
export { mapping_stores };
