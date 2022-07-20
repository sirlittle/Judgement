import type { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import { JudgementDeck } from './objects/deck';
import { Card } from './objects/card';
import { Player } from './objects/player';

export const simulateGames: HttpFunction = async (req, res) => {
    let numberOfGames = 1;
    let numberOfPlayers = 5;
    if (req.body.numberOfGames && req.body.numberOfPlayers) {
        numberOfGames = req.body.numberOfGames;
        numberOfPlayers = req.body.numberOfPlayers;
    }
    const gameResults = await runGames(numberOfGames, numberOfPlayers);
    res.status(200).send(gameResults);
}

const runGames = async (numberOfGames: number, numberOfPlayers: number) => {
    const games = [];
    for (let i = 0; i < numberOfGames; i++) {
        games.push(runSingleGameOfGermanBridge)
    }
    return Promise.all(games.map(game => game(numberOfPlayers)));
}

const runSingleGameOfGermanBridge = async (numberOfPlayers: number) => {
    // create array of size number of players with unique ids
    const players: Player[] = Array.from(Array(numberOfPlayers), (_, i) => new Player(i));
    let scores: { [id: number]: number } = {};
    players.forEach(player => scores[player.id] = 0);
    let startingPlayer = 0;
    for (let roundNum = 0; roundNum < 12; roundNum++) {
        const numberOfCards = getNumberOfCards(roundNum);
        playRound(players, numberOfCards, scores, startingPlayer);
        startingPlayer = (startingPlayer + 1) % numberOfPlayers;
    }
    return scores;
}

const playRound = (players: Player[], numCards: number, scores: { [id: number]: number }, startingPlayer: number) => {
    let deck = new JudgementDeck();
    // Deal out cards to each player
    // Get All Player Predictions for the round
    let predictions: {[playerId:number]: number} = {}
    let trumpCard = deck.getTrumpCard()
    for (let i = 0; i < players.length; i++) {
        let indexOfPlayer = (startingPlayer + i) % players.length;
        const player = players[indexOfPlayer];
        player.getDealtCards(deck.deal(numCards));
        predictions[player.id] = player.predict(numCards, players.length - 1, trumpCard, i === players.length - 1);
    }
    console.log(`Predictions: ${JSON.stringify(predictions)}`);
    // Play the round
    let cardsPlayedInOrder: Card[] = [];
    let curHandsMade: {[playerId:number]: number} = {};
    players.forEach(player => curHandsMade[player.id] = 0);
    for (let handNumber = 0; handNumber < numCards; handNumber++) {
        for (let playerNumber = 0; playerNumber < players.length; playerNumber++) {
            let indexOfPlayer = (startingPlayer + playerNumber) % players.length;
            const player = players[indexOfPlayer];
            const cardToPlay = player.playCard(cardsPlayedInOrder, trumpCard);

            cardsPlayedInOrder.push(cardToPlay);
        }

        // set starting player to player that won the hand
        let currentPlayer = startingPlayer;
        let winningPlayer = startingPlayer;
        let winningCard = cardsPlayedInOrder[0];
        let trumpSeen = winningCard.suit === trumpCard.suit;
        for (let cardNumber = 1; cardNumber < cardsPlayedInOrder.length; cardNumber++) {
            let nextCard = cardsPlayedInOrder[cardNumber];
            currentPlayer = (currentPlayer + 1) % players.length;
            if (winningCard.suit == nextCard.suit && winningCard.rank < nextCard.rank) {
                winningCard = nextCard;
                winningPlayer = currentPlayer;
            } else if ( !trumpSeen && nextCard.suit === trumpCard.suit) {
                trumpSeen = true;
                winningCard = nextCard;
                winningPlayer = currentPlayer;
            }
        }
        curHandsMade[winningPlayer]++;
        startingPlayer = winningPlayer;
    }

    // Update scores
    // Get all Player Scores based on their predictions
    players.forEach(player => {
        const prediction = predictions[player.id];
        if (prediction === curHandsMade[player.id]) {
            scores[player.id] += getScore(prediction);
        }
    })
    return scores;
}

function getScore(prediction: number): number {
    return (prediction + 1) * 10 + prediction;
}

function getNumberOfCards(roundNum: number) {
    if (roundNum < 6) {
        return (6 - roundNum) + 2;
    } else {
        return (roundNum - 5) + 2;
    }
}