import pandas as pd
import requests
import urllib
import re

# CSVファイルの読み込み
file_path = 'izakaya.csv'  # ここにCSVファイルのパスを入力してください
df = pd.read_csv(file_path)

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

# Apply the function to clean addresses in the dataframe
df['Cleaned_Address'] = df['address'].apply(clean_address)

# 各住所に関数を適用
df['Coordinates'] = df['Cleaned_Address'].apply(address_to_lat_lon)

# 緯度と経度の列を作成
df['Longitude'], df['Latitude'] = zip(*df['Coordinates'])

# Coordinates列を削除
df.drop('Coordinates', axis=1, inplace=True)

# 結果を新しいCSVファイルに保存
output_file_path = 'izakaya_with_lat_lon.csv'
df.to_csv(output_file_path, index=False)
