# from bs4 import BeautifulSoup
# import csv

# file_name = 'donki.txt'

# # ファイルを開いてHTMLデータを読み込む
# with open(file_name, 'r', encoding='utf-8') as file:
#     html_data = file.read()

# # BeautifulSoupオブジェクトを作成
# soup = BeautifulSoup(html_data, 'html.parser')

# # # CSVファイルに書き込む
# # with open('stores.csv', mode='w', newline='', encoding='utf-8') as file:
# #     writer = csv.writer(file)
# #     writer.writerow(['店舗名', 'URL', '営業時間'])

# #     # 各店舗のデータを抽出
# #     for store in soup.find_all('div', class_='shopList__store'):
# #         # 店舗名を取得
# #         store_name = store.find('h4', class_='shopList__storeName').get_text(strip=True)

# #         # URLを取得
# #         url_tag = store.find('a', class_='btn')
# #         url = url_tag['href'] if url_tag else 'URL情報なし'

# #         # 営業時間を取得
# #         business_hours_tag = store.find('dd', text=lambda text: '営業時間' in text)
# #         business_hours = business_hours_tag.find_next_sibling('dd').get_text(strip=True) if business_hours_tag else '営業時間情報なし'

# #         # CSVに書き込み
# #         writer.writerow([store_name, url, business_hours])


# # 各店舗のデータを抽出
# for store in soup.find_all('div', class_='shopList__store'):
#     # 店舗名を取得
#     store_name_tag = store.find('h4', class_='shopList__storeName')
#     store_name = store_name_tag.text.strip() if store_name_tag else None

#     # 営業時間を取得
#     business_hours_tag = store.find('dt', text='営業時間').find_next_sibling('dd')
#     business_hours = business_hours_tag.text.strip() if business_hours_tag else None

#     # 住所を取得
#     address_tag = store.find('dt', text='住所').find_next_sibling('dd')
#     address = address_tag.text.strip() if address_tag else None

#     print(f'店舗名: {store_name}')
#     print(f'営業時間: {business_hours}')
#     print(f'住所: {address}')
#     print('---')


import csv
from bs4 import BeautifulSoup

file_name = 'donki.txt'
csv_file = 'donki_data.csv'

# ファイルを開いてHTMLデータを読み込む
with open(file_name, 'r', encoding='utf-8') as file:
    html_data = file.read()

# BeautifulSoupオブジェクトを作成
soup = BeautifulSoup(html_data, 'html.parser')

# CSVファイルを開き、ライターを作成
with open(csv_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['店舗名', '営業時間', '住所'])  # ヘッダーを書き込む

    # 各店舗のデータを抽出
    for store in soup.find_all('div', class_='shopList__store'):
        # 店舗名を取得
        store_name_tag = store.find('h4', class_='shopList__storeName')
        store_name = store_name_tag.text.strip() if store_name_tag else None

        # 営業時間を取得
        business_hours_tag = store.find('dt', text='営業時間').find_next_sibling('dd')
        business_hours = business_hours_tag.text.strip() if business_hours_tag else None

        # 住所を取得
        address_tag = store.find('dt', text='住所').find_next_sibling('dd')
        address = address_tag.text.strip() if address_tag else None

        # CSVに書き込み
        writer.writerow([store_name, business_hours, address])