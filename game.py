class Card:
    suits = ["Hearts", "Diamonds", "Spades", "Clubs"]
    rank = [str(i) for i in range(2,11)] + ["Jack", "Queen", "King", "Ace"]
    def _init_(self, suit, rank):

playGame = True
while playGame:
