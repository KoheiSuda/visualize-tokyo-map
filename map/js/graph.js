import { stores } from "./main.js";

function createGraph(cityName, currentTime, currentDayIndex) {
    let data = stores.filter((store) =>
        store.Cleaned_Address.includes(cityName)
    );
    // データを genre でグループ化
    let dataGroupedByGenre = d3.group(data, (d) => d.genre);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 480 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    const y = d3.scaleBand().range([height, 0]).padding(0.1);
    const x = d3.scaleLinear().range([0, width]);

    var svg = d3
        .select("#graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain([0, 1000]);
    y.domain(shopData[0].genre);
    // グループ化したデータに対してバーを描画
    dataGroupedByGenre.forEach((value, key) => {
        let total = value.length;
        //console.log(total);
        svg.selectAll(".bar")
            .data(value)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("width", function (d) {
                return x(total);
            })
            .attr("y", function (d) {
                return y(key); // y軸の位置は genre のキーに基づく
            })
            .attr("height", y.bandwidth());
    });

    var xAxis = svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    xAxis
        .append("text") // x軸のラベルを追加
        .attr("class", "label")
        .attr("x", width / 2) // 中央に配置
        .attr("y", 30) // 軸から少し下に移動
        .style("text-anchor", "middle") // 中央揃え
        .style("fill", "black") // 黒色に設定
        .text("rate");

    // add the y Axis
    var yAxis = svg.append("g").call(d3.axisLeft(y));

    yAxis
        .append("text") // y軸のラベルを追加
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2) // 中央に配置
        .attr("y", -30) // 軸から少し左に移動
        .style("text-anchor", "middle") // 中央揃え
        .style("fill", "black") // 黒色に設定
        .text("genre");
}

export { createGraph };
