from openai import OpenAI
client = OpenAI()


prompt = "資料にある営業時間を正規化したいn|月|火|水|木|金|土|日の順で[‘12:00~13:00’, ‘14:00~20:00’][‘12:00~13:00’][‘12:00~13:00’][‘12:00~13:00’][‘12:00~13:00’][‘12:00~13:00’][‘12:00~13:00’]のように描きたい。定休日は何も入れずに、同じ日で複数回開く場合はカンマで区切ってください。csv形式で出力してください"
completion = client.chat.completions.create(
  model="gpt-4-1106-preview",
  messages=[
    {"role": "system", "content": "あなたはOpenAIによってトレーニングされた大規模言語モデルのChatGPTです。ユーザーの指示には注意深く従ってください。マークダウンを使用して応答してください。"},
    {"role": "user", "content":[ 
        {"type": "text", "text": prompt},
        {"type":"csv", "csv": "Capstone-project-B-Creators/onohara/data/cafetime/tokyo_cafe_C13101.csv"}]}
  ],
  temperature = 0.1
)


print(completion.choices[0].message)