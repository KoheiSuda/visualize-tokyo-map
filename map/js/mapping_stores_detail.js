// Create a color mapping function
const colorScale = d3
    .scaleOrdinal()
    .domain(shopData[0].genre)
    .range(shopData[0].color);

// 営業時間を表示するための処理をする関数
function formatBusinessHours(businessHoursStr) {
    try {
        const validJsonStr = businessHoursStr.replace(/'/g, '"');
        const businessHours = JSON.parse(validJsonStr);

        const days = ["月", "火", "水", "木", "金", "土", "日"];
        let formattedHours = businessHours.map((dayHours, index) => {
            let sortedHours = dayHours
                .map((timeRange) => {
                    const [start, end] = timeRange
                        .split("~")
                        .map((time) => time.trim());
                    return { start, end };
                })
                .sort((a, b) => a.start.localeCompare(b.start));

            let mergedHours = mergeTimeRanges(sortedHours);

            return (
                days[index] +
                "：" +
                mergedHours
                    .map((range) => `${range.start}~${range.end}`)
                    .join(", ")
            );
        });

        return formattedHours.join("<br/>");
    } catch (e) {
        console.error("Error parsing business hours:", e);
        return "";
    }
}

function mergeTimeRanges(timeRanges) {
    let mergedRanges = [];
    let lastRange = null;

    timeRanges.forEach((range) => {
        if (lastRange && lastRange.end === range.start) {
            lastRange.end = range.end;
        } else {
            mergedRanges.push(range);
            lastRange = range;
        }
    });

    return mergedRanges;
}

const mapping_stores_detail = (stores, g, projection, choice_genres, map) => {
    // ジャンルに基づいてソートする関数
    function sortByGenre(a, b) {
        return choice_genres[a.genre][1] - choice_genres[b.genre][1];
    }

    // ソートを適用
    stores.sort(sortByGenre);

    const filteredStores = stores.filter(
        (store) => choice_genres[store.genre][0]
    );
    const circles = g
        .selectAll("circle.store")
        .data(filteredStores, (d) => d.id); // Assuming each store has a unique 'id' property

    circles
        .enter()
        .append("circle")
        .attr("class", "store")
        .attr("cx", (d) => {
            const point = map.latLngToLayerPoint(
                new L.LatLng(d.Latitude, d.Longitude)
            );
            return point.x;
        })
        .attr("cy", (d) => {
            const point = map.latLngToLayerPoint(
                new L.LatLng(d.Latitude, d.Longitude)
            );
            return point.y;
        })
        .attr("r", currentRadius) // 点の半径
        .attr("fill-opacity", currentOpacity) // 点の透明度
        .attr("fill", (d) => colorScale(d.genre)) // 点の色
        .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", "black");
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
                .html(
                    d.genre +
                        "<br/>" +
                        d.store_name +
                        "<br/>" +
                        formatBusinessHours(d.business_hours)
                )
                .style("left", event.pageX + "px") // カーソルの右側に表示
                .style("top", event.pageY - 28 + "px"); // カーソルの下側に表示
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", (d) => colorScale(d.genre));
            tooltip.transition().duration(500).style("opacity", 0);
        })
        .merge(circles); // For updating existing circles if needed

    circles.exit().remove(); // Remove circles that are no longer in the data
    analogTime(
        d3.selectAll("circle.store"),
        currentTime,
        currentDayIndex,
        count
    );
};
export { mapping_stores_detail };
