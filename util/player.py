import random

class Player:
    def __init__(self, name): 
        self.hand = []
        self.name = name

    def predict(self, numCards, numLeft, last = False):
        if not last:
            return random.randint(1,numCards)
        else:
            num = random.randint(1,numCards)
            while num == numLeft:
                num = random.randint(1,numCards)
            return num

    def getLegalMoves(self, cardsPlayed):
        if cardsPlayed == []:
            return self.hand
        firstSuit = cardsPlayed[0].suit
        cardsOfSuit = [card for card in self.hand if card.suit == firstSuit]
        if cardsOfSuit == []:
            return self.hand
        return cardsOfSuit


    def choose(self, cardsPlayed):
        moves = self.getLegalMoves(cardsPlayed)
        card = random.choice(moves)
        self.hand.remove(card)
        return card
