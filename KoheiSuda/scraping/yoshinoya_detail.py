import requests
from bs4 import BeautifulSoup

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

url_path = 'yoshinoya_url.txt'
with open(url_path, 'r') as file:
    for line in file:
        url = line.strip()
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        f = soup.find('id', type='w_7_pagetitle_2_1-title-text')
        print(f)
        break
        #f = soup.find('body')
        #f = f.find('div', id='main-container')
        #f = f.select('table', class_='w_7_detail_2_2_5-spot-detail-wrap')
        ## 「住所」の情報を取得
        #address_th = soup.select('th', text='住所')
        #print(address_th)
        #address = address_th.find_next_sibling('td').text.strip()
        
        #with open('yoshinoya.txt', 'w') as file:
        #    # 追加されたデータを取得
        #    # 例えば、すべての<li>要素を取得
        #    f = driver.find_element(By.ID, 'w_7_searchresult_1_1_spot-info-list-items')
        #    list_items = f.find_elements(By.TAG_NAME, 'li')
        #    for item in list_items:
        #        f = item.find_element(By.TAG_NAME, 'div')
        #        f = f.find_element(By.TAG_NAME, 'dl')
        #        f = f.find_element(By.TAG_NAME, 'dt')
        #        f = f.find_element(By.TAG_NAME, 'a')
        #        href_value = f.get_attribute('href')
        #        print(href_value)
        #        file.write(href_value + '\n')  # href_valueをファイルに書き込む
        #        ret.append([href_value])

