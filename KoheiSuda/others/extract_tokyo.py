import pandas as pd

# Read the CSV file
df = pd.read_csv(r'C:\Users\denjo\OneDrive\infovis\Capstone-project-B-Creators\map\data\station20230907free.csv', dtype=str)

# Filter the DataFrame for rows where 'pref_cd' is '13'
tokyo_stations = df[df['pref_cd'] == '13']

# Write the filtered data to a new CSV file
tokyo_stations.to_csv('tokyo_station.csv', index=False)