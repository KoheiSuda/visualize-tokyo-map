import csv
import re
import ast

# CSVファイルを読み込む
with open('reform_ramen.csv', 'r') as f:
    reader = csv.reader(f)
    data = list(reader)

# 新しいデータを格納するリスト
new_data = []

# ヘッダ行をスキップ
data = data[1:]

for row in data:
    time_ranges = ast.literal_eval(row[2])
    new_time_ranges = [[],[],[],[],[],[],[]] # 月曜日から日曜日までの時間範囲を格納するリスト
    for i, time_range in enumerate(time_ranges):
        if i > 6:  # 週の日数を超える場合はスキップ
            continue
        for time in time_range:
            # 時間範囲が日付を跨いでいるかどうかを確認する
            if re.match(r'\d{1,2}:\d{2}~\d{1,2}:\d{2}', time) and int(time.split(':')[0]) > int(time.split('~')[1].split(':')[0]):
                # 日付を跨いでいる場合は、次の日に0:00からの時間範囲を追加する
                new_time_ranges[i].append(time.split('~')[0] + '~23:59')
                # 日曜日のデータは月曜日に出力する
                if i == 6:  # Sunday
                    new_time_ranges[0].append('0:00~' + time.split('~')[1])
                else:
                    new_time_ranges[i+1].append('0:00~' + time.split('~')[1])
            elif re.match(r'\d{1,2}:\d{2}~\d{1,2}:\d{2}', time) and int(time.split('~')[1].split(':')[0]) > 23:
                # 24時以降の場合は、次の日に0:00からの時間範囲を追加する
                new_time_ranges[i].append(time.split('~')[0] + '~23:59')
                # 日曜日のデータは月曜日に出力する
                if i == 6:
                    new_time_ranges[0].append('0:00~' + str(int(time.split('~')[1][0:2]) % 24) + ':' + time.split('~')[1][3:])
                else:
                    new_time_ranges[i+1].append('0:00~' + str(int(time.split('~')[1][0:2]) % 24) + ':' + time.split('~')[1][3:])
            else:
                new_time_ranges[i].append(time)
    # 新しい時間範囲を行に追加する
    row[2] = str(new_time_ranges)
    new_data.append(row)

# 結果を新しいCSVファイルに書き出す
with open('new_reform_ramen.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(new_data)