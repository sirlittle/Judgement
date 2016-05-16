from util.card import *
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

class JudgementDeck(Deck):
    def __init__(self):
        Deck.__init__(self)
        self.chooseTrump()

    def chooseTrump(self):
        card = self.deal(1)[0]
        print("The trump is: " + str(card))
        self.trump = card
        self.trumpSuit = card.suit

    def chooseWinner(self, cards, players):
        card1 = cards[0]
        winner = card1
        loc = 0
        for i in range(1,len(cards)):
            compCard = cards[i]
            if winner.suit == compCard.suit && winner.rank < compCard.rank:
                loc = i
                winner = compCard
            elif compCard.suit == self.trumpSuit:
                loc = i
                winner = compCard
        return players[i]






