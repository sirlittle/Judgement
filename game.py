from util.card import *
from util.deck import *
from util.player import *

def getScore(num):
    return (num+1)*10 + num

def round(players, numCards, deck, scores):
    predictions = {}
    sumPredicts = 0
    for i in range(len(players)):
        player = players[i]
        player.hand = deck.deal(numCards)
        curPredict = player.predict(numCards, numCards - sumPredicts, i == len(players) - 1)
        sumPredicts += curPredict
        predictions[player.name] = curPredict
    print("Each player's predictions " + str(predictions))
    print("\n\n")
    curHandsMade = {player.name:0 for player in players}
    for i in range(numCards):
        cardsPlayed = []
        for player in players:
            played = player.choose(cardsPlayed)
            cardsPlayed += [played]
        winner,winningCard = deck.chooseWinner(cardsPlayed,players)
        winnerName = players[winner].name
        players = players[winner:] + players[0:winner]
        curHandsMade[winnerName] += 1
        print("Winner of this hand: " + winnerName)
        print("Winning Card: " + str(winningCard))
        print("Cards in hand: " + str(cardsPlayed))
        print("\n\n")
    for player in players:
        prediction = predictions[player.name]
        handsMade = curHandsMade[player.name]
        if prediction == handsMade:
            scores[player.name] += getScore(prediction)



playGame = True
players = [Player("Bob" + str(i)) for i in range(5)] + [HumanPlayer("Salil")]
scores = {player.name:0 for player in players}
for _ in range(1):
    for i in range(7):
        deck = JudgementDeck()
        numCards = 7-i
        print("starting round " + str(numCards))
        print("\n\n")

        round(players, numCards, deck, scores)
        print("after round scores are: " + str(scores))
        print("\n\n")
    for i in range(1,8):
        deck = JudgementDeck()
        numCards = i
        print("starting round " + str(numCards))
        print("\n\n")
        round(players, numCards, deck, scores)
        print("after round scores are: " + str(scores))
        print("\n\n")
    print("Final scores are " + str(scores))
    playGame = False


