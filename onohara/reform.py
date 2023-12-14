import pandas as pd

df = pd.read_csv('copy_izakaya.csv', dtype=str)

df = df.dropna(subset=['business_hours'])
df['business_hours'] = df['business_hours'].str.replace("翌", "")
df['business_hours'] = df['business_hours'].str.replace("～", "~")
df['business_hours'] = df['business_hours'].str.replace("24時間営業", "0:00~23:59")
df['business_hours'] = df['business_hours'].str.replace("24:00", "23:59")


df = df[~df['business_hours'].str.contains('終了')]
df = df[~df['business_hours'].str.contains('ま')]
df = df[~df['business_hours'].str.contains('営業')]

df.to_csv('reform_izakaya.csv', index=False)