import { mapping_stores, stores, g, projection } from "./map.js";

export var shopData = [
    {
        genre: ["ラーメン", "居酒屋", "カフェ", "クリニック", "ガソリンスタンド"],
        color: ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231"],
    },
];
function genre() {
    // ジャンルと色をマッピング
    var genreColorMap = {};
    for (var i = 0; i < shopData[0].genre.length; i++) {
        genreColorMap[shopData[0].genre[i]] = shopData[0].color[i];
    }

    // ジャンル選択状態を管理するオブジェクトを定義します
    var choice_genres = {};
    for (var i of shopData[0].genre) {
        choice_genres[i] = false;
    }

    // ジャンル選択ボタン
    var legRow = d3
        .select("#checkboxContainer")
        .selectAll("div")
        .data(shopData[0].genre)
        .join("div");

    var container = legRow.append("div").attr("class", "checkbox_container");

    var checkbox = container
        .append("span")
        .attr("class", "checkbox")
        .style("border", "2px solid black")
        .on("click", function (event, d) {
            event.stopPropagation();
            choice_genres[d] = !choice_genres[d];
            var currentCheckbox = d3.select(event.currentTarget);
            if (choice_genres[d]) {
                currentCheckbox
                    .classed("selected", true)
                    .style("background-color", genreColorMap[d]);
            } else {
                currentCheckbox
                    .classed("selected", false)
                    .style("background-color", "white"); // 色を白に戻す
            }
            // 地図上の店舗を更新
            mapping_stores(stores, g, projection, choice_genres);
        });

    container
        .append("span")
        .attr("class", "legLabel")
        .text(function (d) {
            return d;
        });
}
export { genre };
