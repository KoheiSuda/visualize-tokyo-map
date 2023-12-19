import pandas as pd

df = pd.read_csv('modified_gas.csv', dtype=str)

df = df.dropna(subset=['business_hours'])

df = df[~df['business_hours'].str.contains('nan')]

df.to_csv('reform_gas.csv', index=False)