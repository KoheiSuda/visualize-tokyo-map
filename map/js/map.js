const getData = async () => {
    // 日本地図のデータを読み込む
    const japanJson = await d3.json("./data/tokyo.topojson");
    const stations = await d3.csv("./data/train_data_with_coordinates.csv");

    // 店舗データを読み込む
    const stores = await d3.csv("./data/converted_donki_data.csv");
    const topojsonData = topojson.feature(japanJson, japanJson.objects.tokyo);

    return { topojsonData, stores, stations };
};

var ShopData = [
    {
        genre: ["ラーメン", "居酒屋", "カフェ", "スーパー", "コンビニ"],
        color: ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231']
    }
];
//以下数十行はdrawer近辺のこと
var selection = [0,0,];
// ジャンル選択状態を管理するオブジェクトを定義します
var choice_genres = {};
for(var i of ShopData[0].genre) {
    choice_genres[i] = false;
}

// ジャンル選択ボタン
var nav_background_color = "rgb(43, 45, 122)";
var legRow = d3.select(".drawer-menu").selectAll("li").data(ShopData[0].genre).join("li");

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


function style(feature) {
    return {
        fillColor: "none", // 中身の塗りつぶしをなしに
        weight: 2, // 境界線の太さ
        opacity: 1, // 境界線の不透明度
        color: "red", // 境界線の色
        fillOpacity: 0, // 塗りつぶしの不透明度を0に（塗りつぶしなし）
        dashArray: "5, 5", // 点線のパターン（点の長さ、間隔の長さ）
    };
}

function createMap(topojsonData) {
    // 制限された範囲を定義
    var southWest = L.latLng(35.5, 138.9);
    var northEast = L.latLng(35.9, 140);
    var bounds = L.latLngBounds(southWest, northEast);

    // 地図を表示する要素と初期表示する緯度経度、ズームレベルを設定
    var map = L.map("map", {
        maxBounds: bounds, // 地図のビューを制限する
        maxBoundsViscosity: 1.0, // 地図のビューの外にスクロールしにくくする
        minZoom: 10, // 地図を縮小できる最小ズームレベル
    }).setView([35.6895, 139.6917], 10);

    // OpenStreetMapのタイルレイヤーを追加
    L.tileLayer("http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© Gravitystorm",
    }).addTo(map);

    // GeoJSON データを地図に追加
    L.geoJson(topojsonData, { style: style }).addTo(map);

    
    //スライダーおよび時間の変化
    let sliderValue = 0;
    $("#myRange").roundSlider({
        sliderType: "min-range",
        handleShape: "round",
        width: 22,
        radius: 100,
        value: 0,
        max: 47,
        step: 1,
        startAngle: 90,
        editableTooltip: true,
        tooltipFormat: function (args) {
            let hour = Math.floor(args.value / 2);
            let minute = (args.value % 2) * 30;
            hour = hour.toString().padStart(2, "0");
            minute = minute.toString().padStart(2, "0");
            return `${hour}:${minute}`;
        },

        // ツールチップの値が変更されたときに呼び出されるイベントハンドラ
        change: function (args) {
            // args.tooltipTextが時間形式であるかどうかをチェック
            if (args.tooltipText.includes(":")) {
                const time = args.tooltipText.split(":"); // 時間を ":" で分割
                const hour = parseInt(time[0]);
                const minute = parseInt(time[1]);
                const newValue = hour * 2 + minute / 30; // 新しいスライダーの値を計算
                args.value = newValue; // スライダーの値を更新
            }
        },
        drag: function (args) {
            sliderValue = args.value; // スライダーの新しい値を表示

            // スライダーの現在の値を取得
            let hour = Math.floor(sliderValue / 2);
            let minute = (sliderValue % 2) * 30;

            // 現在の時間を24時間制の数値に変換
            const currentTime = Number(hour) + Number(minute) / 60;

            // 各店舗が営業時間内かどうかを判断
            g.selectAll("circle").attr("display", (d) => {
                const businessHoursList = parseBusinessHours(d.営業時間);
                let isWithinBusinessHours = false;
                for (const { start, end } of businessHoursList) {
                    if (start <= currentTime && currentTime < end) {
                        isWithinBusinessHours = true;
                        break;
                    }
                }
                return isWithinBusinessHours ? null : "none";
            });
        }
    });

    // スライダーの初期化
    let slider = $("#myRange").data("roundSlider");

    // 自動再生ボタンの作成
    let autoPlayButton = document.createElement("button");
    autoPlayButton.innerHTML = "Auto Play";
    autoPlayButton.onclick = function() {
        // 1分ごとにスライダーの値を更新
        let intervalId = setInterval(function() {
            let currentValue = slider.getValue();
            if(currentValue >= 47) {
                // スライダーの値が最大に達したら、自動再生を停止
                clearInterval(intervalId);
            } else {
                // スライダーの値を1増やす
                slider.setValue(currentValue + 1);
                // change イベントを手動でトリガー
                slider.options.change({ value: currentValue + 1 });
            }
        }, 60000); // 60000ミリ秒 = 1分
    };

    // ボタンをページに追加
    document.body.appendChild(autoPlayButton);
}

const main = async () => {
    const { topojsonData, stores, stations } = await getData();
    createMap(topojsonData);
};
main();
