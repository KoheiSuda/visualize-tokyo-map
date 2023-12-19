import csv

input_file = r'C:\Users\denjo\OneDrive\infovis\Capstone-project-B-Creators\KoheiSuda\scraping\dental2.csv'
output_file = r'C:\Users\denjo\OneDrive\infovis\Capstone-project-B-Creators\KoheiSuda\scraping\dental3.csv'

# 新しいヘッダー
new_headers = ['genre', 'store_name', 'business_hours', 'address', 'url', 'Cleaned_Address', 'Longitude', 'Latitude', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

# 入力ファイルを開いてデータを読み込む
with open(input_file, 'r', encoding='utf-8') as infile:
    reader = csv.reader(infile)
    data = list(reader)

# 出力ファイルに新しいヘッダーとデータを書き込む
with open(output_file, 'w', newline='', encoding='utf-8') as outfile:
    writer = csv.writer(outfile)
    writer.writerow(new_headers)  # 新しいヘッダーを書き込む
    writer.writerows(data)        # 既存のデータを書き込む