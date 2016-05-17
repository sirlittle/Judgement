import random

class Player:
    def __init__(self, name): 
        self.hand = []
        self.name = name
    
    def getLegalMoves(self, cardsPlayed):
        if cardsPlayed == []:
            return self.hand
        firstSuit = cardsPlayed[0].suit
        cardsOfSuit = [card for card in self.hand if card.suit == firstSuit]
        if cardsOfSuit == []:
            return self.hand
        return cardsOfSuit


    def predict(self, numCards, numLeft, last = False):
        if not last:
            return random.randint(1,numCards)
        else:
            num = random.randint(1,numCards)
            while num == numLeft:
                num = random.randint(1,numCards)
            return num



    def choose(self, cardsPlayed):
        moves = self.getLegalMoves(cardsPlayed)
        card = random.choice(moves)
        self.hand.remove(card)
        return card

class HumanPlayer(Player):
    def predict(self, numCards, numLeft, last = False):
        print("Current predictions are: " + str(numLeft))
        print("Your hand is: " + str(self.hand))
        print("What do you predict to make?")
        return int(input("Prediction: "))

    def choose(self, cardsPlayed):
        legalMoves = self.getLegalMoves(cardsPlayed)
        print("Cards Played So far: " + str(cardsPlayed))
        print("Legal Cards in your hand: " + str(legalMoves))
        card = legalMoves[int(input("Location of card you want to play: \n")) - 1]
        self.hand.remove(card)
        return card
