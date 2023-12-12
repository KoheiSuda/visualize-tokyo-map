import pandas as pd


df = pd.read_csv('./data/ramen/tokyo_ramen_C13114.csv', dtype=str)
# dfから営業時間の列を取り出す
business_hours = df['business_hours']

for i in range(len(business_hours)):
    input = business_hours[i]
    if input == NaN:
        print("NaN")