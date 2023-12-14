/*
function genre() {
    
    var shopData = {
        genre: ["ラーメン", "居酒屋", "カフェ", "スーパー", "ガソリンスタンド"],
        color: ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231"],
    };

    var choiceGenres = shopData.genre.reduce((obj, genre) => {
        obj[genre] = false;
        return obj;
    }, {});

    var legRow = d3
        .select("body")
        .selectAll("li")
        .data(shopData.genre)
        .join("li");

    var container = legRow.append("div").attr("class", "checkbox_container");

    var checkbox = container
        .append("span")
        .attr("class", "checkbox")
        .style("border", "2px solid black")
        .on("click", function (event, d, i) {
            event.stopPropagation();
            choiceGenres[d] = !choiceGenres[d];
            var currentCheckbox = d3.select(event.currentTarget);
            if (choiceGenres[d]) {
                currentCheckbox
                    .classed("selected", true)
                    .style("background-color", shopData.color[i]);
            } else {
                currentCheckbox
                    .classed("selected", false)
                    .style("background-color", "none");
            }
        });

    container
        .append("span")
        .attr("class", "legLabel")
        .text(function (d) {
            return d;
        });
        
    
    var shopData = {
        genre: ["ラーメン", "居酒屋", "カフェ", "スーパー", "ガソリンスタンド"],
        color: ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231"],
    };

    var checkboxes = d3.select("#checkboxes")
        .selectAll("div")
        .data(shopData.genre)
        .enter()
        .append("div");

    checkboxes.append("input")
        .attr("type", "checkbox")
        .attr("id", function(d, i) { return "checkbox" + i; });

    checkboxes.append("label")
        .attr("for", function(d, i) { return "checkbox" + i; })
        .text(function(d) { return d; })
        .style("color", function(d, i) { return shopData.color[i]; });
   
};
export { genre };
*/

function genre() {
    var ShopData = [
        {
            genre: ["ラーメン", "居酒屋", "カフェ", "スーパー", "コンビニ"],
            color: ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231"],
        },
    ];

    // ジャンルと色をマッピング
    var genreColorMap = {};
    for (var i = 0; i < ShopData[0].genre.length; i++) {
        genreColorMap[ShopData[0].genre[i]] = ShopData[0].color[i];
    }

    // ジャンル選択状態を管理するオブジェクトを定義します
    var choice_genres = {};
    for (var i of ShopData[0].genre) {
        choice_genres[i] = false;
    }

    // ジャンル選択ボタン
    var legRow = d3
        .select("#checkboxContainer") // ここを修正
        .selectAll("div")
        .data(ShopData[0].genre)
        .join("div"); // ここを修正

    var container = legRow.append("div").attr("class", "checkbox_container");

    var checkbox = container
        .append("span")
        .attr("class", "checkbox") // CSSでスタイリングするためのclass
        .style("border", "2px solid black") // チェックボックスの枠色を黒に固定
        .on("click", function (event, d) {
            event.stopPropagation(); // 親要素にイベントが伝播するのを阻止
            choice_genres[d] = !choice_genres[d]; // 選択状態を反転
            d3.select(this).style(
                "background-color",
                choice_genres[d] ? genreColorMap[d] : "none"
            ); // 選択時の背景色
        });

    container
        .append("span")
        .attr("class", "legLabel") // クラス名を設定
        .text(function (d) {
            return d;
        });
};
export { genre };