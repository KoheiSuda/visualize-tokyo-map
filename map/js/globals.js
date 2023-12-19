// 現在の透明度と半径を保持するグローバル変数
var currentOpacity = 0.1; // 初期値
var currentRadius = 8; // 初期値

// 現在の時間と曜日を保持するグローバル変数
var currentTime;
var currentDayIndex = 0; // 0 = Sunday

let choice_genres = {};
var shopData = [
    {
        genre: [
            "ラーメン",
            "居酒屋",
            "カフェ",
            "クリニック",
            "ガソリンスタンド",
        ],
        color: ["#ff0000", "#00ff00", "#0000ff", "#4363d8", "#f58231"],
    },
];

// buttonを表示するかどうかを切り替える関数
const toggleButtonDisplay = (buttonId, shouldDisplay) => {
    const button = document.getElementById(buttonId);
    if (button) {
        button.style.display = shouldDisplay ? "block" : "none";
    }
};
