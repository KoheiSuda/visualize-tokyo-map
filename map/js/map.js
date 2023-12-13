const getData = async () => {
    // 日本地図のデータを読み込む
    const japanJson = await d3.json("./data/tokyo.topojson");
    const stations = await d3.csv("./data/train_data_with_coordinates.csv");

    // 店舗データを読み込む
    const stores = await d3.csv("./data/ramen.csv");
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
    //.on("click", reset);

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
        .attr("d", path);

    states.append("title").text((d) => d.properties.nam_ja);

    // 情報表示
    const infoText = svg
        .append("text")
        .attr("x", window.innerWidth - 500) // 位置は必要に応じて調整
        .attr("y", 40)
        .attr("font-size", "20px")
        .text("");

    svg.append("rect")
        .attr("x", 1500)
        .attr("y", 5)
        .attr("width", width)
        .attr("height", 100)
        .attr("stroke", "none")
        .attr("fill", "none");

    var currentInfoText = "";
    var isClicked = false;

    // 地図上に点をプロットする
    g.selectAll("circle")
        .data(stores)
        .join("circle")
        .attr("cx", (d) => projection([+d.Latitude, +d.Longitude])[0])
        .attr("cy", (d) => projection([+d.Latitude, +d.Longitude])[1])
        .attr("r", 3) // 点の半径
        .attr("fill", "rgba(0, 0, 255, 0.2)") // 点の色
        .on("mouseover", (event, d) => {
            if (!d3.select(event.currentTarget).classed("clicked")) {
                // マウスオーバー時に要素の色を赤に変更
                d3.select(event.currentTarget).attr("fill", "white");
            }

            const name = d.店舗名;
            const time = d.営業時間;
            const address = d.住所;
            isClicked = false;
            currentInfoText = `店名: ${name}\n営業時間: ${time}\n住所: ${address}`; // store the current hovered text

            /*
            // 文字列を配列に変換し、joinで連結する
            try {
                let timeArray = JSON.parse(time);
                time = timeArray.join(' ');
            } catch(e) {
                console.error(`時間の解析に失敗しました: ${time}`);
            }
            */
            infoText.text(`店名: ${name}`);
            infoText
                .append("tspan")
                .attr("x", window.innerWidth - 450)
                .attr("dy", 30)
                .text(`営業時間: ${time}`);
            infoText
                .append("tspan")
                .attr("x", window.innerWidth - 450)
                .attr("dy", 30)
                .text(`住所: ${address}`);
        })
        .on("mouseout", () => {
            if (!isClicked) {
                infoText.text(""); // マウスアウト時にテキストをクリア
            }
            if (!d3.select(event.currentTarget).classed("clicked")) {
                // マウスアウト時に要素の色を元に戻す
                d3.select(event.currentTarget).attr(
                    "fill",
                    "rgba(0, 0, 255, 0.2)"
                );
            }
        })

        .on("click", () => {
            // すべての要素から "clicked" クラスを削除し、元の色に戻す
            g.selectAll("circle")
                .classed("clicked", false)
                .attr("fill", "rgba(0, 0, 255, 0.2)");
            // クリックされた要素に "clicked" クラスを追加し、色を白に変更
            d3.select(event.currentTarget)
                .classed("clicked", true)
                .attr("fill", "white");
            // ここにクリック時の処理を書く

            // クリックが発生した場合、マウスオーバーと同じようにinfoTextとtspan要素を設定します。
            isClicked = true; // クリック状態を更新します
            const info = currentInfoText.split("\n"); // 店名、営業時間、住所の各部分を配列に分割します。
            const [name, time, address] = info; // 分割された情報を各変数に代入します。
            infoText.text(name); // `店名: `を消去して表示します。
            infoText
                .append("tspan")
                .attr("x", window.innerWidth - 450)
                .attr("dy", 30)
                .text(time); // `営業時間: `を消去して表示します。
            infoText
                .append("tspan")
                .attr("x", window.innerWidth - 450)
                .attr("dy", 30)
                .text(address); // `住所: `を消去して表示します。
        });

    //// 駅をプロットするためのg要素
    //const gStations = svg.append("g");

    //// 地図上に駅をプロットする
    //gStations
    //    .selectAll("rect")
    //    .data(stations)
    //    .join("rect")
    //    .attr("class", "station")
    //    .attr("x", (d) => projection([+d.Latitude, +d.Longitude])[0] - 2.5) // 中心点を基準にするために調整
    //    .attr("y", (d) => projection([+d.Latitude, +d.Longitude])[1] - 2.5) // 中心点を基準にするために調整
    //    .attr("width", 5) // 四角形の幅
    //    .attr("height", 5) // 四角形の高さ
    //    .attr("fill", "green"); // 点の色

    //window.addEventListener("resize", () => {
    //    width = window.innerWidth;
    //    height = window.innerHeight;
    //    svg.attr("width", width).attr("height", height);
    //    infoText.attr("x", window.innerWidth - 200);
    //});

    //const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

    //svg.call(zoom);

    //function reset() {
    //    states.transition().style("fill", null);
    //    svg.transition()
    //        .duration(750)
    //        .call(
    //            zoom.transform,
    //            d3.zoomIdentity,
    //            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    //        );
    //}

    //function clicked(event, d) {
    //    const [[x0, y0], [x1, y1]] = path.bounds(d);
    //    event.stopPropagation();
    //    states.transition().style("fill", null);
    //    d3.select(this).transition().style("fill", "red");
    //    svg.transition()
    //        .duration(750)
    //        .call(
    //            zoom.transform,
    //            d3.zoomIdentity
    //                .translate(width / 2, height / 2)
    //                .scale(
    //                    Math.min(
    //                        8,
    //                        0.9 /
    //                            Math.max((x1 - x0) / width, (y1 - y0) / height)
    //                    )
    //                )
    //                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
    //            d3.pointer(event, svg.node())
    //        );
    //}

    //function zoomed(event) {
    //    const { transform } = event;
    //    g.attr("transform", transform);
    //    g.attr("stroke-width", 1 / transform.k);
    //    gStations.attr("transform", transform);
    //    gStations.attr("stroke-width", 1 / transform.k);
    //}
};

export { getData };
export { createMap };
