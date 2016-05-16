from Card import *
import random

class Deck:
    def __init__(self):
        self.deck = []
        for suit in range(4):
            for rank in range(13):
                self.deck += [Card(suit, rank)]
        random.shuffle(self.deck)
        random.shuffle(self.deck)
        random.shuffle(self.deck)
        random.shuffle(self.deck)
    
    def deal(self, n=5):
        if len(self.deck) - n < 0:
            print("Can't deal more cards than are in the deck")
            return []
        return [self.deck.pop() for _ in range(n)]

    def shuffle(self):
        random.shuffle(self.deck)

    def __str__(self):
        return str(self.deck)
  
    def __repr__(self):
        return str(self.deck)
