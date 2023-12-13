import pandas as pd

# CSVファイルを読み込む
df = pd.read_csv('tokyo_stations.csv')

# 必要な列だけを抽出する
df_extracted = df[['station_name', 'address']]

# 新しいCSVファイルに出力する
df_extracted.to_csv('name_address_post_station.csv', index=False)