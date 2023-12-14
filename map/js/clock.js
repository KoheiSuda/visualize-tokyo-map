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
