import requests
from bs4 import BeautifulSoup

# ファイルパスを指定
file_path = 'urls.txt'

ret = []

# ファイルを開き、各行を順に処理
with open(file_path, 'r') as file:
    for line in file:
        url = line.strip()

        # ページのHTMLを取得
        response = requests.get(url)
        html = response.content

        # BeautifulSoupオブジェクトを作成
        soup = BeautifulSoup(html, 'html.parser')

        # "card search-shop"クラスを持つすべての要素を取得
        cards = soup.find_all(class_='card search-shop')

        # 各カード要素に対して処理を行う
        for card in cards:
            shop_name_tag = card.find('h5', class_='shop-name font-weight-bold')
            shop_name = shop_name_tag.get_text()
            address_tag = card.find('p', class_='shop-address')
            address = address_tag.get_text()
            span = card.find('p', class_='open-time').find('span')
            span = card.find('p', class_='open-time').find('span')
            if span.get_text() == '24時間営業':
                business_hours = span.get_text()
            elif span.get_text() == '営業時間':
                business_hours = span.next_sibling.strip()
            else:  # <span>要素が見つからない場合
                business_hours = None
            ret.append([shop_name, address, business_hours])

import csv

with open('gas.csv', 'w', newline='', encoding='utf-8-sig') as f:  # Excelでの互換性のために utf-8-sig を使用
    writer = csv.writer(f)
    writer.writerows(ret)
