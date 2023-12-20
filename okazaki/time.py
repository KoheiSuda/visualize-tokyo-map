import pandas as pd
import ast

# CSVファイルを読み込む
df = pd.read_csv('dental_time.csv')


# 曜日ごとの営業時間を格納するための列を追加する
days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
for day in days:
    df[day] = ''

# 各行の営業時間を曜日ごとの列に分割する
for index, row in df.iterrows():
    business_hours = ast.literal_eval(row['business_hours'])
    for i, hours in enumerate(business_hours):
        df.at[index, days[i]] = str(hours)

# 結果を新しいCSVファイルに書き出す
df.to_csv('dental_finished.csv', index=False)