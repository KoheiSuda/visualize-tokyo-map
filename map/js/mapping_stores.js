import { shopData } from "./shopData.js";

// Create a color mapping function
const colorScale = d3
    .scaleOrdinal()
    .domain(shopData[0].genre)
    .range(shopData[0].color);



const mapping_stores = (stores, g, projection, choice_genres) => {
    // ジャンルに基づいてソートする関数
    function sortByGenre(a, b) {
        return choice_genres[a.genre][1] - choice_genres[b.genre][1];
    }
    
    // ソートを適用
    stores.sort(sortByGenre);

    const filteredStores = stores.filter((store) => choice_genres[store.genre][0]);
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

    const opaInput = document.getElementById("opa");
    const radInput = document.getElementById("rad");

    opaInput.addEventListener("input", updateOpacity);
    radInput.addEventListener("input", updateRadius);

    function updateOpacity() {
        const newOpacity = opaInput.value / 100; // range inputの値は0から48なので、0から1の範囲に正規化
        d3.selectAll("circle.store").attr("opacity", newOpacity);
    }

    function updateRadius() {
        const newRadius = radInput.value; // range inputの値をそのまま半径として使用
        d3.selectAll("circle.store").attr("r", newRadius);
    }

    circles.exit().remove(); // Remove circles that are no longer in the data
};
export { mapping_stores };
