import pandas as pd

# CSVファイルを読み込む
df = pd.read_csv('station.csv')

# 郵便番号の最初の2桁を取得
df['post'] = df['post'].str[:2].astype(int)

# 東京の郵便番号の範囲を指定
tokyo_prefixes = list(range(10, 20))

# 東京の郵便番号の範囲に該当する行だけを抽出
df_tokyo = df[df['post'].isin(tokyo_prefixes)]

# 結果を新しいCSVファイルに出力
df_tokyo.to_csv('tokyo_stations.csv', index=False)