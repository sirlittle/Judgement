class Player:
    def __init__(self, name): 
        self.hand = []
        self.name = name

    def getCards(self, cardlist):
        self.hand += cardlist

    