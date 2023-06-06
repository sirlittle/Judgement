import { JudgementDeck } from "../objects/deck";
import { Card } from "../objects/card";
import { Player } from "../objects/player";
import { GameResult, RoundResults, PredictionLog, HandWinnerLog, PlayActionLog, RoundResultLog } from "../objects/logs";
import {Predictions, Hands, HandCounter} from "../objects/game";

export const runGames = async (numberOfGames: number, numberOfPlayers: number): Promise<GameResult[]> => {
    const games = [];
    for (let i = 0; i < numberOfGames; i++) {
      games.push(runSingleGameOfGermanBridge);
    }
    return Promise.all(
      games.map(async (game) => {
        return await game(numberOfPlayers);
      })
    );
  };
  
  const runSingleGameOfGermanBridge = async (numberOfPlayers: number): Promise<GameResult> => {
    // create array of size number of players with unique ids
    const players: Player[] = Array.from(Array(numberOfPlayers), (_, i) => new Player(i));
    let gameScore: number[] = [];
    players.forEach((_player) => gameScore.push(0));
    let startingPlayer = 0;
    let roundResults: RoundResults[] = [];
    for (let roundNum = 0; roundNum < 12; roundNum++) {
      const numberOfCards = getNumberOfCards(roundNum);
      let singleRoundResultLog: RoundResults = await playRound(players, numberOfCards, startingPlayer, roundNum);
      roundResults.push(singleRoundResultLog);
      startingPlayer = (startingPlayer + 1) % numberOfPlayers;
      gameScore = gameScore.map((score, index) => score + singleRoundResultLog.roundScore[index]);
    }
    return {
      roundResults: roundResults,
      gameScore: gameScore,
    };
  };
  
  const playRound = async (players: Player[], numCards: number, startingPlayer: number, roundNumber: number): Promise<RoundResults> => {
    let scores: number[] = [];
    players.forEach((_player) => scores.push(0));
    let deck = new JudgementDeck();
    // Deal out cards to each player
    // Get All Player Predictions for the round
    let predictions: Predictions = {};
    let trumpCard = deck.getTrumpCard();
    let playerToHands: Hands = {};
    let predictionsLog: PredictionLog[] = [];
    let logsInOrder: string[] = [];
    for (let i = 0; i < players.length; i++) {
      let indexOfPlayer = (startingPlayer + i) % players.length;
      const player = players[indexOfPlayer];
      const cardsDealtToPlayer: Card[] = deck.deal(numCards);
      playerToHands[player.id] = cardsDealtToPlayer;
      await player.setDealtCards(cardsDealtToPlayer);
      predictions[player.id] = await player.predict(predictions, trumpCard);
      predictionsLog.push({
        playerId: player.id,
        prediction: predictions[player.id],
        cards: cardsDealtToPlayer,
        trumpCard: trumpCard,
      });
      logsInOrder.push(
        `Player ${player.id} predicted ${predictions[player.id]} for cards ${cardsDealtToPlayer
          .map((card) => card.toString())
          .join(", ")}\n The trump card is ${trumpCard.toString()}`
      );
    }
    // Play the round
    let curHandsMade: HandCounter = {};
    players.forEach((player) => (curHandsMade[player.id] = 0));
    let playActionLog: PlayActionLog[] = [];
    let handWinnerLog: HandWinnerLog[] = [];
    for (let handNumber = 0; handNumber < numCards; handNumber++) {
      let cardsPlayedInOrder: Card[] = [];
      for (let playerNumber = 0; playerNumber < players.length; playerNumber++) {
        let indexOfPlayer = (startingPlayer + playerNumber) % players.length;
        const player = players[indexOfPlayer];
        const cardToPlay = await player.playCard(cardsPlayedInOrder, curHandsMade, predictions, trumpCard);
        playActionLog.push({
          playerId: player.id,
          cardPlayed: cardToPlay,
          handNumber: handNumber,
        });
        logsInOrder.push(`Player ${player.id} played ${cardToPlay.toString()}`);
        cardsPlayedInOrder.push(cardToPlay);
      }
  
      // set starting player to player that won the hand
      const handWinnerInfo = getHandWinner(cardsPlayedInOrder, trumpCard, startingPlayer, players.length);
      curHandsMade[handWinnerInfo.player]++;
      startingPlayer = handWinnerInfo.player;
      handWinnerLog.push({
        handWinnerPlayerId: handWinnerInfo.player,
        handWinnerCard: handWinnerInfo.card,
        handsCardsInOrder: cardsPlayedInOrder,
      });
      logsInOrder.push(`Hand ${handNumber} winner is Player ${handWinnerInfo.player} with ${handWinnerInfo.card.toString()}`);
    }
  
    // Update scores
    // Get all Player Scores based on their predictions
    let roundResultLog: RoundResultLog[] = [];
    players.forEach((player) => {
      const prediction = predictions[player.id];
      let scoreForPlayer = 0;
      if (prediction === curHandsMade[player.id]) {
        scoreForPlayer = getScore(prediction);
      }
      scores[player.id] += scoreForPlayer;
      roundResultLog.push({
        playerId: player.id,
        prediction: prediction,
        actual: curHandsMade[player.id],
        scoreAdded: scoreForPlayer,
        originalHand: playerToHands[player.id],
      });
      logsInOrder.push(`Player ${player.id} scored ${scoreForPlayer} points for prediction ${prediction}`);
    });
    return {
      roundScore: scores,
      logs: {
        predictionInfo: predictionsLog,
        playActionInfo: playActionLog,
        handWinnerInfo: handWinnerLog,
        roundResultInfo: roundResultLog,
        linearLogs: logsInOrder,
      },
    };
  };

  function getHandWinner(hand: Card[], trumpCard: Card, startingPlayer: number, numPlayers: number): {player: number, card: Card} {
    let winningCard = hand[0];
    let currentPlayer = startingPlayer;
    let winningPlayer = startingPlayer;
    let trumpSeen = winningCard.suit === trumpCard.suit;
    for (let cardNumber = 1; cardNumber < hand.length; cardNumber++) {
      let nextCard = hand[cardNumber];
      currentPlayer = (currentPlayer + 1) % numPlayers;
      if (winningCard.suit == nextCard.suit && winningCard.rank < nextCard.rank) {
        winningCard = nextCard;
        winningPlayer = currentPlayer;
      } else if (!trumpSeen && nextCard.suit === trumpCard.suit) {
        trumpSeen = true;
        winningCard = nextCard;
        winningPlayer = currentPlayer;
      }
    }
    return {
      player: winningPlayer,
      card: winningCard,
    };
  }
  
  function getScore(prediction: number): number {
    return (prediction + 1) * 10 + prediction;
  }
  
  function getNumberOfCards(roundNum: number) {
    if (roundNum < 6) {
      return 6 - roundNum + 2;
    } else {
      return roundNum - 5 + 2;
    }
  }
  