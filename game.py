from util.card import *
from util.deck import *
from util.player import *

playGame = True
deck = JudgementDeck()
players = [Player(i) for i in range(5)]

while playGame:
    playGame = False
