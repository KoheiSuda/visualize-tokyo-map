import pandas as pd
import re

# CSVデータを読み込む
df = pd.read_csv('ramen.csv', dtype=str)

# 曜日のリスト
days = ['月', '火', '水', '木', '金', '土', '日']

# 営業時間データの解析と出力
for index, row in df.iterrows():
    store_name = row['store_name']
    business_hours = row['business_hours']
    if pd.isna(business_hours):
        print(f"{store_name}: 営業時間情報なし")
        continue

    # 曜日の範囲を個々の曜日に展開
    for i in range(len(days) - 1):
        business_hours = re.sub(rf"{days[i]}〜{days[i+1]}", ''.join(days[i:i+2]), business_hours)

    # 営業時間を曜日ごとに分割
    for day in days:
        if day in business_hours:
            day_hours = re.findall(rf"{day}[^\d]*((\d+:\d+~\d+:\d+)[^日月火水木金土]*)", business_hours)
            if day_hours:
                # 営業時間を指定された形式にフォーマット
                formatted_hours = [f'"{hours[1]}"' for hours in day_hours]
                print(f"{store_name} ({day}曜日): {formatted_hours}")
            else:
                print(f"{store_name} ({day}曜日): 情報なし")