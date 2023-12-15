var radians = 0.0174532925,
    clockRadius = 135,
    margin = 50,
    width = (clockRadius + margin) * 2,
    height = (clockRadius + margin) * 2,
    hourHandLength = (2 * clockRadius) / 3,
    secondTickStart = clockRadius,
    secondTickLength = -10,
    hourTickStart = clockRadius,
    hourTickLength = -18,
    hourLabelRadius = clockRadius - 40,
    hourLabelYOffset = 7;

var hourScale = d3.scaleLinear().range([0, 330]).domain([0, 11]);
var secondScale = d3.scaleLinear().range([0, 354]).domain([0, 59]);
var handData = [
    {
        type: "hour",
        value: 0,
        length: -hourHandLength,
        scale: hourScale,
    },
];

function drawClock() {
    //create all the clock elements
    updateData(); //draw them in the correct starting position
    var svg = d3
        .select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "clock-svg"); // IDを追加

    var face = svg
        .append("g")
        .attr("id", "clock-face")
        .attr(
            "transform",
            "translate(" +
                (clockRadius + margin) +
                "," +
                (clockRadius + margin) +
                ")"
        );

    //add marks for seconds
    face.selectAll(".second-tick")
        .data(d3.range(0, 60))
        .enter()
        .append("line")
        .attr("class", "second-tick")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", secondTickStart)
        .attr("y2", secondTickStart + secondTickLength)
        .attr("transform", function (d) {
            return "rotate(" + secondScale(d) + ")";
        });
    //and labels

    //... and hours
    face.selectAll(".hour-tick")
        .data(d3.range(0, 12))
        .enter()
        .append("line")
        .attr("class", "hour-tick")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", hourTickStart)
        .attr("y2", hourTickStart + hourTickLength)
        .attr("transform", function (d) {
            return "rotate(" + hourScale(d) + ")";
        });

    face.selectAll(".hour-label")
        .data(d3.range(3, 13, 3))
        .enter()
        .append("text")
        .attr("class", "hour-label")
        .attr("text-anchor", "middle")
        .attr("x", function (d) {
            return hourLabelRadius * Math.sin(hourScale(d) * radians);
        })
        .attr("y", function (d) {
            return (
                -hourLabelRadius * Math.cos(hourScale(d) * radians) +
                hourLabelYOffset
            );
        })
        .text(function (d) {
            return d;
        });

    var hands = face.append("g").attr("id", "clock-hands");

    face.append("g")
        .attr("id", "face-overlay")
        .append("circle")
        .attr("class", "hands-cover")
        .attr("x", 0)
        .attr("y", 0)
        .attr("r", clockRadius / 20);

    hands
        .selectAll("line")
        .data(handData)
        .enter()
        .append("line")
        .attr("class", function (d) {
            return d.type + "-hand";
        })
        .attr("x1", 0)
        .attr("y1", function (d) {
            return d.balance ? d.balance : 0;
        })
        .attr("x2", 0)
        .attr("y2", function (d) {
            return d.length;
        })
        .attr("transform", function (d) {
            return "rotate(" + d.scale(d.value) + ")";
        });
}

function moveHands() {
    d3.select("#clock-hands")
        .selectAll("line")
        .data(handData)
        //.transition()
        .attr("transform", function (d) {
            return "rotate(" + d.scale(d.value) + ")";
        });
}

function updateData() {
    var t = new Date();
    handData[0].value = (t.getHours() % 12) + t.getMinutes() / 60;
}

drawClock();

d3.select(self.frameElement).style("height", height + "px");

// 何回0時になったかをカウントして午前午後を判定
var count = 0;
let tmp;
let currentTime;
var drag = d3.drag().on("drag", function (event, d) {
    var dx = event.x,
        dy = event.y,
        angle = Math.atan2(dy, dx) * (180 / Math.PI);
    // 角度を最も近い15度の倍数に丸める
    angle = Math.round(angle / 15) * 15;
    angle += 90; // 0度を12時の方向にする
    tmp = d.value;
    d.value = ((angle + 360) % 360) / 30;
    if (tmp - d.value === 11.5) {
        count += 1;
    } else if (tmp - d.value === -11.5) {
        count -= 1;
    }
    currentTime = d.value + (count % 2) * 12;
    moveHands();
});
d3.select(".hour-hand").call(drag);

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

function analogTime(g) {
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
    currentDayIndex = (count / 2) % 7;
    document.getElementById("currentDay").textContent =
        daysOfWeek[currentDayIndex];
    g.selectAll("circle.store").attr("display", (d) => {
        console.log(d);
        const businessHoursList = parseBusinessHours(
            d[daysOfWeek[currentDayIndex]]
        );
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
export { analogTime };
