import random

class Player:
    """
    This is the general Player class. It implements the random AI.
    All classes that extend this can only overwrite the predict and choose
    function.
    """
    def __init__(self, name): 
        self.hand = []
        self.name = name
        self.won = 0
    
    def getLegalMoves(self, cardsPlayed):
        if cardsPlayed == []:
            return self.hand
        firstSuit = cardsPlayed[0].suit
        cardsOfSuit = [card for card in self.hand if card.suit == firstSuit]
        if cardsOfSuit == []:
            return self.hand
        return cardsOfSuit
    
    def win(self):
        self.won += 1


    def predict(self, numCards, numLeft, curPredictions, trump, last = False):
        if not last:
            self.prediction = random.randint(1,numCards)
            return self.prediction
        else:
            self.prediction = random.randint(1,numCards)
            while self.prediction == numLeft:
                self.prediction = random.randint(1,numCards)
            return self.prediction



    def choose(self, cardsPlayed, trump):
        moves = self.getLegalMoves(cardsPlayed)
        card = random.choice(moves)
        self.hand.remove(card)
        return card

    def reset(self):
        self.won = 0


class HumanPlayer(Player):
    def predict(self, numCards, numLeft, curPredictions, trump, last = False):
        print("Current predictions are: " + str(curPredictions))
        print("Your hand is: " + str(self.hand))
        print("What do you predict to make?")
        self.prediction = int(input("Prediction: "))
        return self.prediction

    def choose(self, cardsPlayed, trump):
        legalMoves = self.getLegalMoves(cardsPlayed)
        print("Cards Played So far: " + str(cardsPlayed))
        print("Legal Cards in your hand: " + str(legalMoves))
        card = legalMoves[int(input("Location of card you want to play: \n")) - 1]
        self.hand.remove(card)
        return card

class AggressiveBot(Player):
    def numTrump(self, trump):
        return len([card for card in self.hand if card.suit == trump])

    def predict(self, numCards, numLeft, curPredictions, trump, last = False):
        self.prediction = self.numTrump(trump.suit)
        return self.prediction

    def choose(self, cardsPlayed, trump):
        moves = self.getLegalMoves(cardsPlayed)
        if self.won <= self.prediction:
            for card in moves:
                if self.wouldWinCurHand(cardsPlayed + [card], card,trump.suit):
                    self.hand.remove(card)
                    return card
            card = random.choice(moves)
            self.hand.remove(card)
            return card
        else:
            for card in moves:
                if not self.wouldWinCurHand(cardsPlayed + [card], card,trump.suit):
                    self.hand.remove(card)
                    return card
            card = random.choice(moves)
            self.hand.remove(card)
            return card


    def wouldWinCurHand(self, cardsPlayed, card, trumpSuit):
        card1 = cardsPlayed[0]
        winner = card1
        loc = 0
        trumpSeen = winner.suit == trumpSuit
        for i in range(1,len(cardsPlayed)):
            compCard = cardsPlayed[i]
            if winner.suit == compCard.suit and winner.rank < compCard.rank:
                winner = compCard
            elif compCard.suit == trumpSuit and not trumpSeen:
                winner = compCard
        return winner==card
