import pandas as pd
import requests
import urllib
import re
import csv

# 住所から緯度経度を取得する関数
def address_to_lat_lon(address):
    make_url = "https://msearch.gsi.go.jp/address-search/AddressSearch?q="
    s_quote = urllib.parse.quote(address)
    response = requests.get(make_url + s_quote)
    try:
        coordinates = response.json()[0]["geometry"]["coordinates"]
        return coordinates
    except:
        return [None, None]
    
# Function to remove postal code and extra spaces from the address
def clean_address(address):
    # Remove Japanese postal code (usually starts with 〒 followed by 7 digits)
    address_without_postal = re.sub(r'〒\d{3}-\d{4}', '', address)
    # Strip extra spaces
    cleaned_address = address_without_postal.strip()
    return cleaned_address

# [駅名, 住所, 始発, 終電]
data = [["東京", "東京都千代田区丸の内１丁目", "5:01", "1:01"], ["千歳船橋", "東京都世田谷区船橋１丁目１", "4:58", "0:46"], ["八王子", "東京都八王子市旭町1丁目", "6:20", "0:47"]]

# dataからデータフレームを作成
df = pd.DataFrame(data, columns=['name', 'address', 'first_train', 'last_train'])

# 各住所に関数を適用して緯度と経度を取得
df['Coordinates'] = df['address'].apply(address_to_lat_lon)

# 緯度と経度の列を作成
df['Latitude'], df['Longitude'] = zip(*df['Coordinates'])

# Coordinates列を削除
df.drop('Coordinates', axis=1, inplace=True)

# 新しいCSVファイルに保存
with open('train_data_with_coordinates.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['name', 'Latitude', 'Longitude', 'first_train', 'last_train'])  # ヘッダーを書き込む

    for index, row in df.iterrows():
        writer.writerow([row['name'], row['Latitude'], row['Longitude'], row['first_train'], row['last_train']])