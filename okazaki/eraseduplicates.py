import pandas as pd

# CSVファイルを読み込む
df = pd.read_csv('name_address_post_station.csv')

# 重複行を削除
df = df.drop_duplicates()

# 結果を新しいCSVファイルに書き出す
df.to_csv('simplified_tokyo_stations.csv', index=False)