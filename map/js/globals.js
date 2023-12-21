// 現在の透明度と半径を保持するグローバル変数
var currentOpacity = 1; // 初期値
var currentRadius = 2; // 初期値

// 現在の時間と曜日を保持するグローバル変数
var currentTime = 0; // 0 = 0:00 AM
var currentDayIndex = 0; // 0 = Sunday

let choice_genres = {};
var shopData = [
    {
        genre: ["ラーメン", "居酒屋", "カフェ", "歯医者", "ガソリンスタンド"],
        color: ["#cc0000", "#008000", "#A99663", "#0067C0", "#A1A3A6"],
    },
];

// buttonを表示するかどうかを切り替える関数
const toggleButtonDisplay = (buttonId, shouldDisplay) => {
    const button = document.getElementById(buttonId);
    if (button) {
        button.style.display = shouldDisplay ? "block" : "none";
    }
};

let tooltip;

document.addEventListener("DOMContentLoaded", (event) => {
    tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip") // CSSでスタイリング可能なクラス名
        .style("opacity", 0);
});

document.addEventListener("DOMContentLoaded", (event) => {
    // その他のDOMContentLoadedイベントのコード...

    // スライダー要素を取得
    var slider = document.getElementById("rad");

    // スライダーの値が変更されたときのイベントリスナーを追加
    if (slider) {
        slider.addEventListener("input", function () {
            // スライダーの現在の値に基づいてつまみの幅を計算
            var thumbSize = 20 + (this.value / this.max) * 30;

            // つまみのスタイルを動的に更新
            this.style.setProperty("--thumb-size", thumbSize + "px");
        });
    }
});
