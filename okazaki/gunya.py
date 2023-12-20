import pandas as pd

# CSVファイルを読み込む
df = pd.read_csv('dental_updated.csv')

# DataFrame内の全ての文字列データに対して、'～'を'~'に置換する
df.replace('～', '~', regex=True, inplace=True)

# 置換後のデータを新しいCSVファイルに書き出す
df.to_csv('genre_finished.csv', index=False)