import pandas as pd
import re
from collections import defaultdict

# CSVデータを読み込む
df = pd.read_csv('../map/data/ramen_updated.csv')

def parse_business_hours(business_hours_str):
    if not isinstance(business_hours_str, str):
        return []
    business_hours_list = re.sub(r"[\[\]' ]", "", business_hours_str).split(",")
    result = []
    for business_hours in business_hours_list:
        try:
            start, end = business_hours.split("~")
            start_hour, start_minute = map(int, start.split(":"))
            end_hour, end_minute = map(int, end.split(":"))
            start = start_hour + start_minute / 60
            end = end_hour + end_minute / 60
            result.append({'start': start, 'end': end})
        except ValueError:
            continue
    return result

# 各時間帯に営業している店舗数をカウントする
open_counts = defaultdict(int)
for index, row in df.iterrows():
    if 'Monday' not in row:
        continue
    business_hours = parse_business_hours(row['Monday'])
    for hour in business_hours:
        for i in range(int(hour['start']), int(hour['end'])):
            open_counts[i] += 1

print(open_counts)