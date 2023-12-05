from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# WebDriverのセットアップ
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

# 吉野家の東京都の店舗一覧ページのURL
url = 'https://stores.yoshinoya-holdings.com/yoshinoya-holdings/spot/list?c_d9=0&c_d11=0&c_d10=0&c_d12=0&category=0101.0101001.0101002.0101003.0101004&limit=30&address=13'

# ページにアクセス
driver.get(url)

# 必要な要素を取得
f = driver.find_element(By.ID, 'main-container')
f = f.find_element(By.ID, 'w_7_searchresult_1_1-widget')
f = f.find_element(By.ID, 'w_7_searchresult_1_1-widget-body')
f = f.find_element(By.ID, 'w_7_searchresult_1_1_spot-info-list-items')

# 各<li>要素に対して処理を行う
list_items = f.find_elements(By.TAG_NAME, 'li')
for item in list_items:
    print(item.text)
print(len(list_items))

# WebDriverを閉じる
driver.quit()


#import requests
#from bs4 import BeautifulSoup

## 吉野家の東京都の店舗一覧ページのURL
#url = 'https://stores.yoshinoya-holdings.com/yoshinoya-holdings/spot/list?c_d9=0&c_d11=0&c_d10=0&c_d12=0&category=0101.0101001.0101002.0101003.0101004&limit=30&address=13'

## リクエストを送る
#response = requests.get(url)
#soup = BeautifulSoup(response.text, 'html.parser')

#ret = []
#f = soup.find('body')
#f = f.find('div', id='main-container')
#f = f.find('div', id='w_7_searchresult_1_1-widget')
#f = f.find('div', id='w_7_searchresult_1_1-widget-body')
#f = f.find('ul', id='w_7_searchresult_1_1_spot-info-list-items')
#print(f)
#list_items = f.find_all('li')
#for item in list_items:
#    print(item)
    #info = []
    #f = item.find('div', class_='row')
    #f = f.find('dl', class_='w_7_searchresult_1_1_spot-info-list col-xs-12 col-sm-12')
    #f = f.find('dt', class_='w_7_searchresult_1_1-spot-name')
    #if f:
    #    print(f.text)
    #a_tag = f.find('a', href=True)  # href属性を持つ最初の<a>タグを見つける
    #if a_tag:
    #    url = a_tag['href']  # href属性の値を取得
    #    print(url)  # hrefの内容を表示
