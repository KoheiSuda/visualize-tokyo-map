// 仮のShopDataを定義します
var ShopData = [
    {
        genre: ["Genre1", "Genre2", "Genre3", "Genre4", "Genre5"],
        color: ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231']
    }
];

// ジャンル選択状態を管理するオブジェクトを定義します
var choice_genres = {};
for(var i of ShopData[0].genre) {
    choice_genres[i] = false;
}

// ジャンル選択ボタン
var nav_background_color = "rgb(43, 45, 122)";
var choiced_color = "#7885bb";
var legRow = d3.select(".drawer-menu").selectAll("li").data(ShopData[0].genre).join("li");
legRow.append("div")
    .style("background",function(d){ 
        if (choice_genres[d]) {
            return choiced_color;
        }
        return "#FFFFFF";})
    .style("cursor","pointer")
    .on("click", function(event,d) {
        var isSelected = !choice_genres[d];
        d3.select(this)
            .classed("selected", isSelected); /* ここをクラスで切り替える */
        
        if (choice_genres[d]) {
            choice_genres[d] = false;
        }
        else {
            choice_genres[d] = true;
        }
        legRow.selectAll("div")
            .style("background",function(d){ 
                if (choice_genres[d]) {
                    return choiced_color;
                }
                return "#FFFFFF";
            }); 
    })
    .append("span")

var container = legRow.append("div")
    .attr("class", "checkbox_container");

var checkbox = container.append("span")
    .attr("class", "checkbox") // CSSでスタイリングするためのclass
    .style("border", "2px solid black") // チェックボックスの枠色を黒に固定
    .on("click", function(event, d, i) {
        event.stopPropagation(); // 親要素にイベントが伝播するのを阻止
        var isSelected = !choice_genres[d];
        d3.select(this)
            .style("background-color", isSelected ? ShopData[0].color[i]: "none"); // 選択時の背景色
          
        if (choice_genres[d]) {
            choice_genres[d] = false;
        }
        else {
            choice_genres[d] = true;
        }
    });

container.append("span")
    .attr("class", "legLabel") // クラス名を設定
    .text(function(d) { return d; });