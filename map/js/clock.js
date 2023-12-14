/*
var hour = 0;
var preTime = 0;
var time = 30;
var isLocked = false;
var deg_m = 6 * time;
var deg_h = hour * 30 + deg_m / 12;
// var userSetHour = hour;
// var userSetTime = time;
function setClock(x, y) {

  var clk = document.getElementById('scale');
  var rect = clk.getBoundingClientRect();  // 画面左上を基準とする位置
 
  // document（ページ左上）からの絶対座標
  var x1 = clk.clientWidth / 2;
  var y1 = clk.clientHeight / 2;

  // console.log(x1, y1);

  var deg = Math.atan2((x - x1), -(y - y1)) * 360 / (2 * Math.PI);

  if (deg <= 0) {
    deg += 360;
  }
  preTime = time;
  time = Math.round(deg / 6);

  if (55 <= time && time <= 60 && 0 <= preTime && preTime <= 5) {
    if (isLocked) {
      isLocked = false;
    } else if (hour == 0) {
      deg = 0;
      document.querySelector(".min").style.transform = `rotate(${deg}deg)`;
      isLocked = true;
    } else {
      --hour;
    }
  }

  if (55 <= preTime && preTime <= 60 && 0 <= time && time <= 5) {
    // if (time == 0 && preTime == 60) {
    // hour = Math.min(hour + 1, 2);
    if (isLocked) {
      isLocked = false;
    } else if (hour == 2) {
      deg = 355;
      document.querySelector(".min").style.transform = `rotate(${deg}deg)`;
      isLocked = true;
    } else {
      ++hour;
    }

  }
  // console.log(hour, userSetTime);

  if (isLocked) {
    return
  }
  userSetHour = hour;
  userSetTime = time;
  if (userSetTime == 60) {
    --userSetTime;
  }
  // 針の角度
  deg_m = 6 * time;
  deg_h = hour * 30 + deg_m / 12;
  // var deg_s = now.getSeconds() * (360 / 60);
  if (hour == 0) {
    document.getElementById("setTime").innerHTML = time + "min";
  } else {
    document.getElementById("setTime").innerHTML = hour + "h " + time + "min";
  }
  // それぞれの針に角度を設定
  document.querySelector(".hour").style.transform = `rotate(${deg_h}deg)`;
  document.querySelector(".min").style.transform = `rotate(${deg_m}deg)`;
  // document.querySelector(".sec").style.transform = `rotate(${deg_s}deg)`;
};



window.onload = function () {
  // メモリを追加
  for (let i = 1; i <= 12; i++) {
    // scaleクラスの要素の最後にdiv要素を追加
    let scaleElem = document.querySelector(".scale");
    let addElem = document.createElement("div");
    scaleElem.appendChild(addElem);

    // 角度をつける
    document.querySelector(".scale div:nth-child(" + i + ")").style.transform = `rotate(${i * 30}deg)`;
  }
  if (hour == 0) {
    document.getElementById("setTime").innerHTML = time + "min";
  } else {
    document.getElementById("setTime").innerHTML = hour + "h " + time + "min";
  }
  // それぞれの針に角度を設定
  document.querySelector(".hour").style.transform = `rotate(${deg_h}deg)`;
  document.querySelector(".min").style.transform = `rotate(${deg_m}deg)`;

}

function muuXY(e, that) {
  if (!e) e = window.event;

  // console.log(that);
  var x, y;
  if (e.targetTouches) {
    x = e.targetTouches[0].pageX - e.target.offsetLeft;
    y = e.targetTouches[0].pageY - e.target.offsetTop;
  }
  else if (that) {
    x = e.pageX - that.offsetLeft;
    y = e.pageY - that.offsetTop;
  }
  return [x, y];
}

var isDragged = false;

document.getElementById('clock').onmousemove = function (e) {
  if (isDragged) {
    var xy = muuXY(e, this);
    // console.log('Xの座標は' + xy[0] + 'Yの座標は' + xy[1]);
    setClock(xy[0], xy[1]);
  }
}

var clock = document.getElementById('clock');
clock.onmousedown = function (event) {
  isDragged = true;
  clock.onmouseup = function () {
    isDragged = false;
    // clock.onmouseup = null;
  };
};

clock.ondragstart = function () {
  return false;
};
*/
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
                const businessHoursList = parseBusinessHours(d.Tuesday);//ここをボタンで変更したい
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


    /*
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
    */
}

export {sliderclock};

