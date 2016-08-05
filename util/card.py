class Card:
    suits = ["Hearts", "Diamonds", "Spades", "Clubs"]
    ranks = [str(i) for i in range(2,11)] + ["Jack", "Queen", "King", "Ace"]
    
    def __init__(self, suit, rank):
        self.suit = suit
        self.rank = rank
        self.name = self.ranks[rank] + " of " + self.suits[suit]

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name