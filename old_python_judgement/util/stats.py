import csv

class JudgementStats:
    def __init__(self):
        self.stats = []
        
    def collectRoundData(self, winningCard, winner, trumpSuit, numCards):
        """
        Format of what needs to be collected is as follows:
        Winning Rank, Whether it is trump, which player it comes from,
        and how many cards were in that round.
        """
        isTrump = winningCard.suit == trumpSuit
        if isTrump:
            curStat = [winningCard.rank + 1, 1, winner, numCards]
        else:
            curStat = [winningCard.rank + 1, 0, winner, numCards]
        self.stats.append(curStat) 

    def writeToCSV(self, nameOfFile):
        with open(nameOfFile, 'a') as f:
            writer = csv.writer(f)
            for stat in self.stats:
                writer.writerow(stat)

