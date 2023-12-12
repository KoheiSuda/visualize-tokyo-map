import requests
from bs4 import BeautifulSoup
import re
import pandas as pd
import time
import warnings
warnings.filterwarnings('ignore', category=FutureWarning)


class Tabelog:
    """
    食べログスクレイピングクラス
    test_mode=Trueで動作させると、最初のページの３店舗のデータのみを取得できる
    """
    def __init__(self, base_url, test_mode=False, p_ward='東京都内', begin_page=1, end_page=400):
        
        # 変数宣言
        self.store_id = ''
        self.store_id_num = 0
        self.store_name = ''
        self.score = 0
        self.ward = p_ward
        self.review_cnt = 0
        self.review = ''
        self.columns = ['store_id', 'store_name', 'business_hours', 'address', 'url']  # 更新された列名
        self.df = pd.DataFrame(columns=self.columns)
        self.__regexcomp = re.compile(r'\n|\s') # \nは改行、\sは空白
        
        page_num = begin_page # 店舗一覧ページ番号
        
        if test_mode:
            list_url = base_url + str(page_num) +  '/' #食べログの点数ランキングでソートする際に必要な処理を削除
            # list_url = base_url + str(page_num) +  '/?Srt=D&SrtT=rt&sort_mode=1' #食べログの点数ランキングでソートする際に必要な処理
            self.scrape_list(list_url, mode=test_mode)
        else:
            while True:
                list_url = base_url + str(page_num) +  '/' #食べログの点数ランキングでソートする際に必要な処理を削除
                # list_url = base_url + str(page_num) +  '/?Srt=D&SrtT=rt&sort_mode=1' #食べログの点数ランキングでソートする際に必要な処理
                if self.scrape_list(list_url, mode=test_mode) != True:
                    break
                
                # INパラメータまでのページ数データを取得する
                if page_num >= end_page:
                    break
                page_num += 1
        return

    def scrape_list(self, list_url, mode):
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
    

        if mode:
            for soup_a in soup_a_list[:2]:
                item_url = soup_a.get('href') # 店の個別ページURLを取得
                self.store_id_num += 1
                self.scrape_item(item_url, mode)
        else:
            for soup_a in soup_a_list:
                item_url = soup_a.get('href') # 店の個別ページURLを取得
                self.store_id_num += 1
                self.scrape_item(item_url, mode)

        # Check if there is a link to the next page
        next_page_link = soup.find('a', rel='next')
        if next_page_link is None:
            return False  # This is the last page

        return True

    def scrape_item(self, item_url, mode):
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

        # ラーメンorつけ麺のお店ではない場合は処理対象外
        if store_head_list[0].text not in {'カフェ', '喫茶店'}:
            # print('ラーメンorつけ麺のお店ではないので処理対象外')
            self.store_id_num -= 1
            return
        
        # 店舗名称取得
        store_name_tag = soup.find('h2', class_='display-name')
        store_name = store_name_tag.span.string.strip()
        self.store_name = store_name
        
        # 営業時間と住所の取得
        soup_table = soup.find("table", class_="c-table c-table--form rstinfo-table__table")
        business_hours, address = self.get_business_hours_and_address(soup_table)
        # 住所情報のクリーニング（不要な文字列の削除）
        unwanted_texts = ["大きな地図を見る", "周辺のお店を探す"]
        for text in unwanted_texts:
            address = address.replace(text, "").strip()

        # データフレームの生成
        self.make_df(item_url, store_name, business_hours, address)
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

    def make_df(self, url, store_name, business_hours, address):
        self.store_id = str(self.store_id_num).zfill(8)  # 0パディング
        # 住所に特定の文字列が含まれていない場合のみデータフレームに追加
        if "このお店は" not in address and "から移転しています" not in address:
            se = pd.Series([self.store_id, store_name, business_hours, address, url], self.columns)  # 行を作成
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
    print("https://tabelog.com/tokyo/" + code + "/rstLst/cafe/")
    tokyo_cafe = Tabelog(base_url="https://tabelog.com/tokyo/" + code + "/rstLst/cafe/",test_mode=False, p_ward='東京都内')
    tokyo_cafe.df.to_csv("data/tokyo_cafe_" + code + ".csv")
