const mapping_stations = (stations, station_lines, g, projection) => {
    // Create a map of station codes to coordinates
    const stationCoords = new Map(
        stations.map((s) => [s.station_cd, [s.lon, s.lat]])
    );

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
        .attr("stroke", "black")
        .attr("stroke-width", 2);
};

export { mapping_stations };
