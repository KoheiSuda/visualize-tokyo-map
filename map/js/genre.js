import { mapping_stores } from "./mapping_stores.js";
import { mapping_stores_detail } from "./mapping_stores_detail.js";
import { stores } from "./main.js";
import { shopData } from "./shopData.js";
import { projection } from "./projection.js";
import { detailMap, gd } from "./detail_map.js";
import { g } from "./map.js";

let choice_genres = {};
let order = 0;

function genre() {
    // ジャンルと色をマッピング
    var genreColorMap = {};
    for (var i = 0; i < shopData[0].genre.length; i++) {
        genreColorMap[shopData[0].genre[i]] = shopData[0].color[i];
    }

    // ジャンル選択状態を管理するオブジェクトを定義します
    for (var i of shopData[0].genre) {
        choice_genres[i] = [false, 0];
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
            choice_genres[d][0] = !choice_genres[d][0];
            if (choice_genres[d][0] == true) {
                choice_genres[d][1] = order + 1;
                order += 1;
            }else{
                choice_genres[d][1] = 0;
            }
            var currentCheckbox = d3.select(event.currentTarget);
            if (choice_genres[d][0]) {
                currentCheckbox
                    .classed("selected", true)
                    .style("background-color", genreColorMap[d]);
            } else {
                currentCheckbox
                    .classed("selected", false)
                    .style("background-color", "white"); // 色を白に戻す
            }
            // 地図上の店舗を更新
            if (detailMap !== undefined){
                //console.log(gd);
                mapping_stores_detail(stores, gd, projection, choice_genres, detailMap);
            }else{
                //console.log(g);
                mapping_stores(stores, g, projection, choice_genres);
            }
        });

    container
        .append("span")
        .attr("class", "legLabel")
        .text(function (d) {
            return d;
        });
}
export { genre, choice_genres };
