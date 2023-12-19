import pandas as pd

# CSVファイルを読み込む
df = pd.read_csv('reform_gas.csv')

df['business_hours'] = df['business_hours'].apply(lambda x: str(x))

# 各曜日の営業時間を設定
for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']:
    df[day] = df['business_hours']

# genreとurl列を追加
df['genre'] = 'ガソリンスタンド'
df['url'] = 'N/A'

# 列の順序を変更
df = df[['genre', 'store_name', 'business_hours', 'address', 'url', 'Cleaned_Address', 'Longitude', 'Latitude', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']]

df.to_csv('gas_reform.csv', index=False)