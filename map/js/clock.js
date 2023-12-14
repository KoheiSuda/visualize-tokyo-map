const clock = () => {
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
        },
    });

    // スライダーの初期化
    let slider = $("#myRange").data("roundSlider");

    // 自動再生ボタンの作成
    let autoPlayButton = document.createElement("button");
    autoPlayButton.innerHTML = "Auto Play";
    autoPlayButton.onclick = function () {
        // 1分ごとにスライダーの値を更新
        let intervalId = setInterval(function () {
            let currentValue = slider.getValue();
            if (currentValue >= 47) {
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
};

export { clock };
