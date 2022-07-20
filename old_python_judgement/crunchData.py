import pandas as pd

df = pd.read_csv('dataRun1.csv', names=["rank","trump","player_num","num_cards"])
rankToNums = df.groupby('rank').size()
winsByPlayerOrder = df.groupby('player_num').size()
