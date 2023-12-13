import requests
from bs4 import BeautifulSoup
import re
import pandas as pd
import time
import warnings
warnings.filterwarnings('ignore', category=FutureWarning)

class Tabelog:
    def __init__(self, base_url, p_ward='東京都内', food_type=['ラーメン', 'つけ麺']):
        
        # 変数宣言
        self.store_id_num = 0
        self.store_name = ''
        self.ward = p_ward
        self.columns = ['genre', 'store_name', 'business_hours', 'address', 'url']  # 更新された列名
        self.df = pd.DataFrame(columns=self.columns)
        
        page_num = 1 # 店舗一覧ページ番号
        
        while True:
            list_url = base_url + str(page_num) +  '/' 
            if self.scrape_list(list_url, food_type=food_type) != True:
                break
            page_num += 1
        return

    def scrape_list(self, list_url, food_type):
        """
        店舗一覧ページのパーシング
        """
        r = requests.get(list_url)
        if r.status_code != requests.codes.ok:
            return False
        
        soup = BeautifulSoup(r.content, 'html.parser')
        soup_a_list = soup.find_all('a', class_='list-rst__rst-name-target') # 店名一覧

        if len(soup_a_list) == 0:
            return False
        
        for soup_a in soup_a_list:
            item_url = soup_a.get('href') # 店の個別ページURLを取得
            self.store_id_num += 1
            self.scrape_item(item_url,food_type)

        # Check if there is a link to the next page
        next_page_link = soup.find('a', rel='next')
        if next_page_link is None:
            return False  # This is the last page
        
        return True

    def scrape_item(self, item_url,food_type):
        """
        個別店舗情報ページのパーシング
        """
        start = time.time()
        
        r = requests.get(item_url)
        if r.status_code != requests.codes.ok:
            print(f'error:not found{ item_url }')
            return

        soup = BeautifulSoup(r.content, 'html.parser')

        # 店舗情報のヘッダー枠データ取得
        store_head = soup.find('div', class_='rdheader-subinfo')
        store_head_list = store_head.find_all('dl')
        store_head_list = store_head_list[1].find_all('span')

        # food_typeではない場合は処理対象外
        if store_head_list[0].text not in food_type:
            self.store_id_num -= 1
            return
        
        # 店舗名称取得
        store_name_tag = soup.find('h2', class_='display-name')
        store_name = store_name_tag.span.string.strip()
        self.store_name = store_name
        
        # 営業時間と住所の取得
        soup_table = soup.find("table", class_="c-table c-table--form rstinfo-table__table")
        business_hours, address = self.get_business_hours_and_address(soup_table)
        unwanted_time = ["営業時間・定休日は変更となる場合がございますので、ご来店前に店舗にご確認ください。"]
        for business_hour in unwanted_time:
            business_hours = business_hours.replace(business_hour, "").strip()
        # 住所情報のクリーニング（不要な文字列の削除）
        # 改行文字以降を削除
        address = re.sub("\n.*", "", address)
        unwanted_texts = ["大きな地図を見る", "周辺のお店を探す"]
        for text in unwanted_texts:
            address = address.replace(text, "").strip()

        # ジャンルの取得
        genre = food_type[0]
        # データフレームの生成
        self.make_df(item_url, store_name, business_hours, address, genre)
        return

    def get_business_hours_and_address(self, soup_table):
        """
        営業時間と住所の抽出
        """
        business_hours = address = ''
        soup_tr_list = soup_table.find_all("tr")
        for soup_tr in soup_tr_list:
            if soup_tr.th.string == "営業時間":
                business_hours = soup_tr.td.get_text().strip()
            elif soup_tr.th.string == "住所":
                address = soup_tr.td.get_text().strip()
        return business_hours, address

    def make_df(self, url, store_name, business_hours, address,genre):
        se = pd.Series([genre, store_name, business_hours, address, url], self.columns)  # 行を作成
        self.df = self.df.append(se, ignore_index=True)  # データフレームに行を追加

codes = [
    "C13101", "C13102", "C13103", "C13104", "C13105", "C13106", "C13107", "C13108", 
    "C13109", "C13110", "C13111", "C13112", "C13113", "C13114", "C13115", "C13116", 
    "C13117", "C13118", "C13119", "C13120", "C13121", "C13122", "C13123", 
    "C13201", "C13202", "C13203", "C13204", "C13205", "C13206", "C13207", "C13208", 
    "C13209", "C13210", "C13211", "C13212", "C13213", "C13214", "C13215", 
    "C13218", "C13219", "C13220", "C13221", "C13222", "C13223", "C13224", "C13225", 
    "C13227", "C13228", "C13229", 
    "C13303", "C13305", "C13307", "C13308"
]

for code in codes:
    print("https://tabelog.com/tokyo/" + code + "/rstLst/ramen/")
    tokyo_ramen = Tabelog(base_url="https://tabelog.com/tokyo/" + code + "/rstLst/ramen/",food_type=['ラーメン', 'つけ麺'])
    tokyo_ramen.df.to_csv("data/ramen/tokyo_ramen_" + code + ".csv")

for code in codes:
    print("https://tabelog.com/tokyo/" + code + "/rstLst/cafe/")
    tokyo_cafe = Tabelog(base_url="https://tabelog.com/tokyo/" + code + "/rstLst/cafe/",food_type=['カフェ', '喫茶店'])
    tokyo_cafe.df.to_csv("data/cafe/tokyo_cafe_" + code + ".csv")

for code in codes:
    print("https://tabelog.com/tokyo/" + code + "/rstLst/izakaya/")
    tokyo_izakaya = Tabelog(base_url="https://tabelog.com/tokyo/" + code + "/rstLst/izakaya/",food_type=['居酒屋'])
    tokyo_izakaya.df.to_csv("data/izakaya/tokyo_izakaya_" + code + ".csv")
