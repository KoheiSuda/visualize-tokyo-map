import pandas as pd

# CSVファイルを読み込む
df = pd.read_csv('dental.csv')

# 'genre'列を追加し、全ての値を'クリニック'に設定する
df.insert(0, 'genre', 'クリニック')

# 結果を新しいCSVファイルに書き出す
df.to_csv('dental_genre.csv', index=False)