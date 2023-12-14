import pandas as pd

# Load the datasets
join_df = pd.read_csv(r'C:\Users\denjo\OneDrive\infovis\Capstone-project-B-Creators\map\data\join20230907.csv')
tokyo_station_df = pd.read_csv(r'C:\Users\denjo\OneDrive\infovis\Capstone-project-B-Creators\map\data\tokyo_station.csv')

# Convert station codes in tokyo_station_df to a set for faster lookup
tokyo_station_codes = set(tokyo_station_df['station_cd'])

# Filter rows where both station_cd1 and station_cd2 are in the tokyo_station_codes set
filtered_join_df = join_df[join_df['station_cd1'].isin(tokyo_station_codes) & join_df['station_cd2'].isin(tokyo_station_codes)]

# Write the filtered data to a new CSV file
filtered_join_df.to_csv('tokyo_join.csv', index=False)
