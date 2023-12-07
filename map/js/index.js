/**
 * data を読み込む関数
 */
const getData = async () => {
    // 日本地図のデータを読み込む
    const japanJson = await d3.json("./data/tokyo.topojson");
    // 店舗データを読み込む
    const stores = await d3.csv("./data/donki_data_with_lat_lon.csv");
    const topojsonData = topojson.feature(japanJson, japanJson.objects.tokyo);

    return { topojsonData, stores };
};

const createGraphs = (topojsonData, stores) => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

    const svg = d3
        .select("#map")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;")
        .on("click", reset);

    const projection = d3
        .geoMercator()
        .center([139.4917, 35.6895])
        .translate([width / 2, height / 2])
        .scale(40000);

    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");

    const states = g
        .append("g")
        .attr("fill", "#444")
        .attr("cursor", "pointer")
        .selectAll("path")
        .data(topojsonData.features)
        .join("path")
        .on("click", clicked)
        .attr("d", path);

    states.append("title").text((d) => d.properties.nam_ja);

    svg.call(zoom);

    // ツールチップのdiv要素を作成
    //const tooltip = d3
    //    .select("body")
    //    .append("div")
    //    .attr("class", "tooltip")
    //    .style("opacity", 0);

    // 情報表示
    const infoText = svg
        .append("text")
        .attr("x", 10) // 位置は必要に応じて調整
        .attr("y", 30)
        .attr("font-size", "20px")
        .text("");

    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", 100)
        .attr("stroke", "black")
        .attr("fill", "none");

    // 地図上に点をプロットする
    g.selectAll("circle")
        .data(stores)
        .join("circle")
        .attr("cx", (d) => projection([+d.Latitude, +d.Longitude])[0])
        .attr("cy", (d) => projection([+d.Latitude, +d.Longitude])[1])
        .attr("r", 5) // 点の半径
        .attr("fill", "blue") // 点の色
        .on("mouseover", (event, d) => {
            const name = d.店舗名;
            const time = d.営業時間;
            const address = d.住所;
            infoText.text(`店名: ${name}`);
            infoText
                .append("tspan")
                .attr("x", 10)
                .attr("dy", 30)
                .text(`営業時間: ${time}`);
            infoText
                .append("tspan")
                .attr("x", 10)
                .attr("dy", 30)
                .text(`住所: ${address}`);
        })
        .on("mouseout", () => {
            infoText.text(""); // マウスアウト時にテキストをクリア
        });

    window.addEventListener("resize", () => {
        width = window.innerWidth;
        height = window.innerHeight;
        svg.attr("width", width).attr("height", height);
    });

    function reset() {
        states.transition().style("fill", null);
        svg.transition()
            .duration(750)
            .call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
            );
    }

    function clicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        states.transition().style("fill", null);
        d3.select(this).transition().style("fill", "red");
        svg.transition()
            .duration(750)
            .call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(
                        Math.min(
                            8,
                            0.9 /
                                Math.max((x1 - x0) / width, (y1 - y0) / height)
                        )
                    )
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                d3.pointer(event, svg.node())
            );
    }

    function zoomed(event) {
        const { transform } = event;
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
    }
};
/**
 * main 関数
 * 読み込み時一度だけ実行される
 */
const main = async () => {
    // data を読み込む
    const { topojsonData, stores } = await getData();
    createGraphs(topojsonData, stores);
};
main();
