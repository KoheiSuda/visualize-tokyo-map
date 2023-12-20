import pandas as pd

# CSVファイルを読み込む
df = pd.read_csv('dental_genre_latlng.csv')

# 列の順序を変更する
df = df[['genre', 'store_name', 'business_hours', 'address', 'Cleaned_Address', 'Longitude', 'Latitude']]

# 結果を新しいCSVファイルに書き出す
df.to_csv('dental_genre_ordered.csv', index=False)