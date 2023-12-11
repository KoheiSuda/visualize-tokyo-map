/**
 * data を読み込む関数
 */
const getData = async () => {
    // 日本地図のデータを読み込む
    const japanJson = await d3.json("./data/tokyo.topojson");
    const stations = await d3.csv("./data/train_data_with_coordinates.csv");
    // 店舗データを読み込む
    const stores = await d3.csv("./data/converted_donki_data.csv");
    const topojsonData = topojson.feature(japanJson, japanJson.objects.tokyo);

    return { topojsonData, stores, stations };
};



const createGraphs = (topojsonData, stores, stations) => {
    
    let width = window.innerWidth;
    let height = window.innerHeight;

    const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

    const svg = d3
        .select("#map")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;")
        .on("click", reset);

    const projection = d3
        .geoMercator()
        .center([139.4917, 35.6895])
        .translate([width / 2, height / 2])
        .scale(40000);

    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");

    const states = g
        .append("g")
        .attr("fill", "#444")
        .attr("cursor", "pointer")
        .selectAll("path")
        .data(topojsonData.features)
        .join("path")
        .on("click", clicked)
        .attr("d", path);

    states.append("title").text((d) => d.properties.nam_ja);

    svg.call(zoom);

    // ツールチップのdiv要素を作成
    //const tooltip = d3
    //    .select("body")
    //    .append("div")
    //    .attr("class", "tooltip")
    //    .style("opacity", 0);

    // 情報表示
    const infoText = svg
        .append("text")
        .attr("x", 10) // 位置は必要に応じて調整
        .attr("y", 30)
        .attr("font-size", "20px")
        .text("");

    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", 100)
        .attr("stroke", "black")
        .attr("fill", "none");

    // 地図上に点をプロットする
    g.selectAll("circle")
        .data(stores)
        .join("circle")
        .attr("cx", (d) => projection([+d.Latitude, +d.Longitude])[0])
        .attr("cy", (d) => projection([+d.Latitude, +d.Longitude])[1])
        .attr("r", 5) // 点の半径
        .attr("fill", "rgba(0, 0, 255, 0.2)")  // 点の色
        .on("mouseover", (event, d) => {
            const name = d.店舗名;
            const time = d.営業時間;
            const address = d.住所;
            infoText.text(`店名: ${name}`);
            infoText
                .append("tspan")
                .attr("x", 10)
                .attr("dy", 30)
                .text(`営業時間: ${time}`);
            infoText
                .append("tspan")
                .attr("x", 10)
                .attr("dy", 30)
                .text(`住所: ${address}`);
        })
        .on("mouseout", () => {
            infoText.text(""); // マウスアウト時にテキストをクリア
        });

    // 駅をプロットするためのg要素
    const gStations = svg.append("g");

    // 地図上に駅をプロットする
    gStations
        .selectAll("rect")
        .data(stations)
        .join("rect")
        .attr("class", "station")
        .attr("x", (d) => projection([+d.Latitude, +d.Longitude])[0] - 2.5) // 中心点を基準にするために調整
        .attr("y", (d) => projection([+d.Latitude, +d.Longitude])[1] - 2.5) // 中心点を基準にするために調整
        .attr("width", 5) // 四角形の幅
        .attr("height", 5) // 四角形の高さ
        .attr("fill", "green"); // 点の色

    window.addEventListener("resize", () => {
        width = window.innerWidth;
        height = window.innerHeight;
        svg.attr("width", width).attr("height", height);
    });

    function reset() {
        states.transition().style("fill", null);
        svg.transition()
            .duration(750)
            .call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
            );
    }

    function clicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        states.transition().style("fill", null);
        d3.select(this).transition().style("fill", "red");
        svg.transition()
            .duration(750)
            .call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(
                        Math.min(
                            8,
                            0.9 /
                                Math.max((x1 - x0) / width, (y1 - y0) / height)
                        )
                    )
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                d3.pointer(event, svg.node())
            );
    }

    function zoomed(event) {
        const { transform } = event;
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
        gStations.attr("transform", transform);
        gStations.attr("stroke-width", 1 / transform.k);
    }
    // スライダーの要素を取得


    // 時間を表示する要素を取得
    const timeDisplay = document.getElementById("timeDisplay");

    // 営業時間を解析する関数
    function parseBusinessHours(businessHoursStr) {
        console.log("Input:", businessHoursStr); // 入力をログに出力

        const businessHoursList = businessHoursStr.split(",");
        const result = businessHoursList.map((businessHours) => {
            const [start, end] = businessHours.split("～").map((time) => {
                // 余分なスペース、引用符、角括弧を削除
                time = time.trim().replace(/['\[\]]/g, "");
                const splitResult = time.split(":");
                console.log("Split result:", splitResult); // 分割結果をログに出力
                const [hour, minute] = splitResult.map(Number);
                return hour + minute / 60;
            });
            return { start, end };
        });

        console.log("Output:", result); // 出力をログに出力

        return result;
    }

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
};



/**
 * main 関数
 * 読み込み時一度だけ実行される
 */
const main = async () => {
    // data を読み込む
    const { topojsonData, stores, stations } = await getData();
    createGraphs(topojsonData, stores, stations);
};
main();
