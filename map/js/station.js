const mapping_stations = (stations, station_lines, g, projection) => {
    // Create a map of station codes to coordinates
    const stationCoords = new Map(
        stations.map((s) => [s.station_cd, [s.lon, s.lat]])
    );

    // Define custom colors for each line_cd
    const customColors = {
        11302: "#99cc00", // 山手線
        11311: "#007ac0", // 中央本線
        11312: "#f15a22", // 中央線
        11313: "#ffd400 ", // 中央・総武線
        11321: "#00ac9a", // 埼京線
        11328: "#FFFFFF", // 成田エクスプレス ??????????
        11333: "#e21f26", // 湘南新宿ライン
        24001: "#c8006b", // 京王線
        25001: "#06559d", // お打球小田原線
        28002: "#f62e36", // 丸の内線
        99301: "", // 都営大江戸線
        99304: "", // 都営新宿線
        28001: "#ff9500", // 銀座線
        28006: "#c1a470", // 有楽町線
        28008: "#8f76d6", // 半蔵門線
        28009: "#00ac9b", // 南北線
    };

    g.selectAll("circle.station")
        .data(stations)
        .join("circle")
        .attr("cx", (d) => projection([+d.lon, +d.lat])[0])
        .attr("cy", (d) => projection([+d.lon, +d.lat])[1])
        .attr("r", 3) // Adjust the radius as needed
        .attr("fill", "blue"); // Choose a color that stands out

    // Draw lines
    g.selectAll("line.station")
        .data(station_lines)
        .enter()
        .append("line")
        .attr("x1", (d) => projection(stationCoords.get(d.station_cd1))[0])
        .attr("y1", (d) => projection(stationCoords.get(d.station_cd1))[1])
        .attr("x2", (d) => projection(stationCoords.get(d.station_cd2))[0])
        .attr("y2", (d) => projection(stationCoords.get(d.station_cd2))[1])
        .attr("stroke", (d) => customColors[d.line_cd] || "black") // Default to black if line_cd is not in customColors
        .attr("stroke-width", 2)
        .attr("opacity", 0.8);
};

export { mapping_stations };
