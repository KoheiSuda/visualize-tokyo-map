import pandas as pd

# CSVファイルを読み込む
df = pd.read_csv('cafe/tokyo_cafe_C13101.csv')

# 必要な列だけを抽出する
df_extracted = df[['n', 'business_hours']]

# 新しいCSVファイルに出力する
df_extracted.to_csv('cafetime/tokyo_cafe_C13101.csv', index=False)