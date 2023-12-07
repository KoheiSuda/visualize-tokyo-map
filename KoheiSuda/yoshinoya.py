from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import time

# WebDriverのセットアップ
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

# 吉野家の東京都の店舗一覧ページのURL
url = 'https://stores.yoshinoya-holdings.com/yoshinoya-holdings/spot/list?c_d9=0&c_d11=0&c_d10=0&c_d12=0&category=0101.0101001.0101002.0101003.0101004&limit=30&address=13'

# ページにアクセス
driver.get(url)

# 必要な要素がロードされるのを待つ
wait = WebDriverWait(driver, 10)

# 「もっと見る」ボタンを見つけてクリック
while True:
    try:
        more_button = wait.until(EC.element_to_be_clickable((By.ID, 'w_7_searchresult_1_1-button-more')))
        driver.execute_script("arguments[0].click();", more_button)
        # クリック後にデータがロードされるのを待つ
        time.sleep(2)
    except Exception as e:
        # 「もっと見る」ボタンが存在しない、またはクリックできない場合、ループを抜ける
        print("No more 'もっと見る' button found or not clickable.")
        break

# 追加データがロードされるのを待つ（必要に応じて時間を調整）
time.sleep(2)

ret = []

with open('yoshinoya.txt', 'w') as file:
    # 追加されたデータを取得
    # 例えば、すべての<li>要素を取得
    f = driver.find_element(By.ID, 'w_7_searchresult_1_1_spot-info-list-items')
    list_items = f.find_elements(By.TAG_NAME, 'li')
    for item in list_items:
        f = item.find_element(By.TAG_NAME, 'div')
        f = f.find_element(By.TAG_NAME, 'dl')
        f = f.find_element(By.TAG_NAME, 'dt')
        f = f.find_element(By.TAG_NAME, 'a')
        href_value = f.get_attribute('href')
        print(href_value)
        file.write(href_value + '\n')  # href_valueをファイルに書き込む
        ret.append([href_value])

# WebDriverを閉じる
driver.quit()


#from selenium import webdriver
#from selenium.webdriver.common.by import By
#from selenium.webdriver.chrome.service import Service
#from webdriver_manager.chrome import ChromeDriverManager

## WebDriverのセットアップ
#driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

## 吉野家の東京都の店舗一覧ページのURL
#url = 'https://stores.yoshinoya-holdings.com/yoshinoya-holdings/spot/list?c_d9=0&c_d11=0&c_d10=0&c_d12=0&category=0101.0101001.0101002.0101003.0101004&limit=30&address=13'

## ページにアクセス
#driver.get(url)

## 必要な要素を取得
#f = driver.find_element(By.ID, 'main-container')
#f = f.find_element(By.ID, 'w_7_searchresult_1_1-widget')
#f = f.find_element(By.ID, 'w_7_searchresult_1_1-widget-body')
#f = f.find_element(By.ID, 'w_7_searchresult_1_1_spot-info-list-items')

## 各<li>要素に対して処理を行う
#list_items = f.find_elements(By.TAG_NAME, 'li')
#for item in list_items:
#    print(item.text)
#print(len(list_items))

## WebDriverを閉じる
#driver.quit()


##import requests
##from bs4 import BeautifulSoup

### 吉野家の東京都の店舗一覧ページのURL
##url = 'https://stores.yoshinoya-holdings.com/yoshinoya-holdings/spot/list?c_d9=0&c_d11=0&c_d10=0&c_d12=0&category=0101.0101001.0101002.0101003.0101004&limit=30&address=13'

### リクエストを送る
##response = requests.get(url)
##soup = BeautifulSoup(response.text, 'html.parser')

##ret = []
##f = soup.find('body')
##f = f.find('div', id='main-container')
##f = f.find('div', id='w_7_searchresult_1_1-widget')
##f = f.find('div', id='w_7_searchresult_1_1-widget-body')
##f = f.find('ul', id='w_7_searchresult_1_1_spot-info-list-items')
##print(f)
##list_items = f.find_all('li')
##for item in list_items:
##    print(item)
#    #info = []
#    #f = item.find('div', class_='row')
#    #f = f.find('dl', class_='w_7_searchresult_1_1_spot-info-list col-xs-12 col-sm-12')
#    #f = f.find('dt', class_='w_7_searchresult_1_1-spot-name')
#    #if f:
#    #    print(f.text)
#    #a_tag = f.find('a', href=True)  # href属性を持つ最初の<a>タグを見つける
#    #if a_tag:
#    #    url = a_tag['href']  # href属性の値を取得
#    #    print(url)  # hrefの内容を表示
