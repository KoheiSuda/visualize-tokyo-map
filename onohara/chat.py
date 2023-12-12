import pandas as pd
import openai
openai.api_key = "OPENAI_API_KEY"

system = """入力される営業時間を正規化したい。月|火|水|木|金|土|日の順で出力してください。定休日は何も入れずに、同じ日で複数回開く場合はカンマで区切ってください。リスト形式で出力してください。出力するのはリスト部分のみで大丈夫です。
例
[['12:00~13:00', '14:00~20:00'], ['12:00~13:00'], ['12:00~13:00'], ['12:00~13:00'], ['12:00~13:00'], ['12:00~13:00'], ['12:00~13:00']]
"""

from openai import OpenAI
client = OpenAI()
df = pd.read_csv('./data/ramen/tokyo_ramen_C13114.csv', dtype=str)
# dfから営業時間の列を取り出す
df['business_hours'] = df['business_hours'].fillna('')
business_hours = df['business_hours']

for i in range(len(business_hours)):
    input = business_hours[i]
    if input == "":
        df['business_hours'][i] = ""
        continue
    completion = client.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": input}

        ],
        temperature=0.0
    )
    #結果をcsvファイルに保存
    print(completion.choices[0].message.content)
    df['business_hours'][i] = completion.choices[0].message.content

df.to_csv('time_convert_ramen.csv', index=False)
