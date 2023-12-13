import pandas as pd
import glob
 
sample_files = glob.glob('./data/izakaya/*.csv')
list = []
for file in sample_files:
    list.append(pd.read_csv(file))
 
df = pd.concat(list)
df = df.drop(df.columns[0], axis=1)
df.to_csv('izakaya.csv',index=False)
