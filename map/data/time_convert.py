# donki_data_with_lat_lon.csvから時刻データを取得
import pandas as pd
timedata = pd.read_csv('donki_data_with_lat_lon.csv')

# 時刻データを取得
donki_time = timedata['営業時間']

def convert_time_format(time_str):
    if time_str == '24時間営業':
        return ['00:00～23:59']
    else:
        start_time, end_time = time_str.split('～')
        end_time = end_time.strip()
        if int(end_time.split(':')[0]) < int(start_time.split(':')[0]):
            return [start_time + '～23:59', '00:00～' + end_time]
        else:
            return [start_time + '～' + end_time]

timedata['営業時間'] = timedata['営業時間'].apply(convert_time_format)

# 変換後のデータを新しいCSVファイルに出力
# timedata.to_csv('converted_donki_data.csv', index=False)

print(timedata['営業時間'])