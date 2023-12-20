const mapping_stations = (stations, station_lines, g, projection) => {
    // Create a map of station codes to coordinates
    const stationCoords = new Map(
        stations.map((s) => [s.station_cd, [s.lon, s.lat]])
    );

    // Define custom colors for each line_cd
    const customColors = {
        11301: "#FF7E1C", // 東海道本線
        11302: "#99cc00", // 山手線
        11303: "#FFE400", // 南武線
        11305: "#EB5C01", // 武蔵野線
        11306: "#85C023", // 横浜線
        11308: "#0074BE", // 横須賀線
        11311: "#007ac0", // 中央本線
        11312: "#f15a22", // 中央線
        11313: "#ffd400", // 中央・総武線
        11314: "#FDD700", // 総武本線
        11315: "#EB5C01", // 青梅線
        11316: "#EB5C01", // 五日市線
        11317: "#A09D95", // 八高線
        11319: "#FF9845", // 高崎線
        11320: "#00C18A", // 常磐線
        11321: "#00ac9a", // 埼京線
        11323: "#FF9845", // 宇都宮線
        11326: "#CF1225", // 京葉線
        11328: "#000000", // 成田エクスプレス ??????????
        11332: "#00A7E3", // 京浜東北線
        11333: "#e21f26", // 湘南新宿ライン
        11334: "", //　上野と東京を結ぶ
        21001: "#10428E", // 東上線
        21002: "#226BB8", // スカイツリーライン
        21005: "#226BB8", // 亀戸線
        21006: "#E83E2F", // 西武山口線
        22001: "#EE7A00", // 西武池袋線
        22003: "#EE7A00", // 西武有楽町線
        22004: "#EE7A00", // 西武豊島線
        22007: "#00A6BF", // 西武新宿線
        22008: "#00A6BF", // 西武拝島線
        22009: "#1EAD4C", // 西武西武園線
        22010: "#1EAD4C", // 西武国分寺線
        22011: "#F7AF0E", // 西武多摩湖線
        22012: "#EF7A00", // 西武多摩川線
        23001: "#0166B3", // 京成本線
        23002: "#0166B3", // 京成押上線
        23003: "#0166B3", // 京成金町線
        23006: "#F47B21", // 成田スカイアクセス
        24001: "#c8006b", // 京王線
        24002: "#c8006b", // 京王相模原線
        24003: "#c8006b", // 京王高尾線
        24004: "#c8006b", // 京王競馬場線
        24005: "#c8006b", // 京王動物園線
        24006: "#004385", // 京王井の頭線
        24007: "#c8006b", // 京王新線
        25001: "#0085CE", // 小田急小田原線
        25003: "#0085CE", // 小田急多摩線
        26001: "#DA0042", // 東急東横線
        26002: "#009CD3", // 東急目黒線
        26003: "#00AA8D", // 東急田園都市線
        26004: "#F18C43", // 東急大井町線
        26005: "#EE86A8", // 東急池上線
        26006: "#AE0079", // 東急多摩川線
        26007: "#FCC800", // 東急世田谷線
        27001: "#0096E0", // 京浜急行線
        27002: "#0096E0", // 京急空港線
        28001: "#FF9500", // 銀座線
        28002: "#f62e36", // 丸の内線
        28003: "#B5B5AC", // 日比谷線
        28004: "#009BBF", // 東西線
        28005: "#00BB85", // 千代田線
        28006: "#C1A470", // 有楽町線
        28008: "#8f76d6", // 半蔵門線
        28009: "#00ac9b", // 南北線
        28010: "#9C5E31", // 副都心線
        29003: "#e21f26", // 湘南新宿ライン ???
        99301: "#C6035D", // 都営大江戸線
        99302: "#E14131", // 都営浅草線
        99303: "#006CB6", // 都営三田線
        99304: "#B0C124", // 都営新宿線
        99305: "#269A45", // 都電荒川線
        99309: "#014081", // つくばエクスプレス
        99311: "#0065A6", // ゆりかもめ
        99334: "#FF963F", // 多摩モノレール
        99342: "#E63181", // 日暮里舎人ライナー
        99340: "#00A3FB", // 北総鉄道
        99337: "#00418E", // りんかい線
        99336: "#003586", // 東京モノレール
    };
    // Bind data for stations
    const stationSquares = g
        .selectAll("rect.station")
        .data(stations)
        .enter()
        .append("rect")
        .attr("class", "station-rect")
        .attr("x", (d) => projection([+d.lon, +d.lat])[0] - 2)
        .attr("y", (d) => projection([+d.lon, +d.lat])[1] - 2)
        .attr("width", 4) // Adjust the size as needed
        .attr("height", 4) // Adjust the size as needed
        .attr("fill", "none") // No fill color
        .attr("opacity", 0.8) // Start with opacity 0
        .attr("stroke", "gray") // Choose a color that stands out
        .attr("stroke-width", 1) // Adjust the stroke width as needed
        //.attr("r", 2) // End with radius 3
        .attr("visibility", "hidden"); // Start hidden

    // Bind data for lines
    const stationLines = g
        .selectAll("line.station")
        .data(station_lines)
        .enter()
        .append("line")
        .attr("class", "station-line")
        .attr("x1", (d) => projection(stationCoords.get(d.station_cd1))[0])
        .attr("y1", (d) => projection(stationCoords.get(d.station_cd1))[1])
        .attr("x2", (d) => projection(stationCoords.get(d.station_cd2))[0])
        .attr("y2", (d) => projection(stationCoords.get(d.station_cd2))[1])
        .attr("stroke", (d) => customColors[d.line_cd] || "black") // Default to black if line_cd is not in customColors
        .attr("stroke-width", 2) // End with stroke-width 2
        .attr("opacity", 0.8) // End with opacity 0.8
        .attr("visibility", "hidden"); // Start hidden

    let stationsVisible = false;
    // Click event handler

    document.getElementById("show-stations").addEventListener("click", () => {
        stationsVisible = !stationsVisible;

        if (stationsVisible) {
            stationSquares.attr("visibility", "visible");
            stationLines.attr("visibility", "visible");

            // .station-line クラスを持つすべての要素を最前面に移動
            document.querySelectorAll(".station-line").forEach((element) => {
                element.parentNode.appendChild(element);
            });

            // .station-rect クラスを持つすべての要素を最前面に移動
            document.querySelectorAll(".station-rect").forEach((element) => {
                element.parentNode.appendChild(element);
            });
        } else {
            stationSquares.attr("visibility", "hidden");
            stationLines.attr("visibility", "hidden");
        }
    });
};

export { mapping_stations };
