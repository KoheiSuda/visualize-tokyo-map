import requests
from bs4 import BeautifulSoup

# ファイルパスを指定
file_path = 'url_dental.txt'

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
        results = soup.find('div', class_='result-box').find_all('div', class_='result')

        count = 0
        # 各カード要素に対して処理を行う
        for result in results:
            name_tag = result.find('a', class_='result__name')
            name = name_tag.get_text()
            address_tag = result.find('i', class_='ico-area-gray result-data__icon')
            address = address_tag.get_text()
            # 営業時間の配列を初期化
            business_hours = [[] for _ in range(7)]  # 月曜から日曜まで

            # 表の各行をイテレート
            for row in result.select('.table-time tr')[1:]:  # 最初の行（ヘッダ）をスキップ
                cells = row.find_all('td')
                time_range = cells[0].get_text().strip().replace('\xa0', '')

                # 各曜日のセルをチェック
                for i in range(1, 8):
                    if cells[i].get_text().strip() == '●':
                        business_hours[i-1].append(time_range)
            ret.append([name, address, business_hours])

import csv

with open('dental.csv', 'w', newline='', encoding='utf-8-sig') as f:  # Excelでの互換性のために utf-8-sig を使用
    writer = csv.writer(f)
    writer.writerows(ret)
