const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

let currentDayIndex = 0; // 0 = Sunday

//スライダーおよび時間の変化
function sliderclock(g) {
    let sliderValue = 0;
    function parseBusinessHours(businessHoursStr) {
        const businessHoursList = businessHoursStr.split(",");
        const result = businessHoursList.map((businessHours) => {
            const [start, end] = businessHours.split("~").map((time) => {
                // 余分なスペース、引用符、角括弧を削除
                time = time.trim().replace(/['\[\]]/g, "");
                const splitResult = time.split(":");
                const [hour, minute] = splitResult.map(Number);
                return hour + minute / 60;
            });
            return { start, end };
        });

        return result;
    }

    function handleSliderChange(args) {
        sliderValue = args.value; // スライダーの新しい値を表示

        if (sliderValue >= 47) {
            currentDayIndex = (currentDayIndex + 1) % 7; // 7 days in a week
        }
        document.getElementById("currentDay").textContent =
            daysOfWeek[currentDayIndex];
        // スライダーの現在の値を取得
        let hour = Math.floor(sliderValue / 2);
        let minute = (sliderValue % 2) * 30;

        // 現在の時間を24時間制の数値に変換
        const currentTime = Number(hour) + Number(minute) / 60;

        // 各店舗が営業時間内かどうかを判断
        g.selectAll("circle.store").attr("display", (d) => {
            const businessHoursList = parseBusinessHours(
                d[daysOfWeek[currentDayIndex]]
            ); //ここをボタンで変更したい
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
        change: handleSliderChange,
        drag: handleSliderChange,
    });

    // スライダーの初期化
    let slider = $("#myRange").data("roundSlider");

    let autoPlayIntervalId = null;

    window.startAutoPlay = function () {
        // 100msごとにスライダーの値を更新
        autoPlayIntervalId = setInterval(function () {
            let currentValue = slider.getValue();
            console.log(currentValue);
            if (currentValue >= 47) {
                currentValue = 0;
                slider.setValue(currentValue + 1);
                slider.options.change({ value: currentValue + 1 });
            } else {
                // スライダーの値を1増やす
                slider.setValue(currentValue + 1);
                // change イベントを手動でトリガー
                slider.options.change({ value: currentValue + 1 });
            }
        }, 100); // 100ミリ秒
    };
    window.stopAutoPlay = function () {
        if (autoPlayIntervalId) {
            clearInterval(autoPlayIntervalId);
            autoPlayIntervalId = null;
        }
    };
}

export { sliderclock };

/*
function clock(g) {
    const slider = document.getElementById("myRange");
    const timeDisplay = document.getElementById("timeDisplay");

    // 営業時間を解析する関数
    function parseBusinessHours(businessHoursStr) {
        const businessHoursList = businessHoursStr.split(",");
        const result = businessHoursList.map((businessHours) => {
            const [start, end] = businessHours.split("~").map((time) => {
                // 余分なスペース、引用符、角括弧を削除
                time = time.trim().replace(/['\[\]]/g, "");
                const splitResult = time.split(":");
                const [hour, minute] = splitResult.map(Number);
                return hour + minute / 60;
            });
            return { start, end };
        });

        return result;
    }

    slider.addEventListener("input", function () {
        let hour = Math.floor(this.value / 2);
        let minute = (this.value % 2) * 30;
        hour = hour.toString().padStart(2, "0");
        minute = minute.toString().padStart(2, "0");
        const currentTime = Number(hour) + Number(minute) / 60;

        // 更新された時間に基づいて店舗の表示を制御
        g.selectAll("circle").attr("display", (d) => {
            const businessHoursList = parseBusinessHours(d.Tuesday);
            let isWithinBusinessHours = false;
            for (const { start, end } of businessHoursList) {
                if (start <= currentTime && currentTime < end) {
                    isWithinBusinessHours = true;
                    break;
                }
            }
            return isWithinBusinessHours ? null : "none";
        });
    });
}

export { clock };
*/
