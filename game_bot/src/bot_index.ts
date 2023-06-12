import express from 'express';
import { Player } from './player';
import { Card, Predictions, HandCounter } from 'judgement_utils';


const app = express();
import portfinder from 'portfinder';
const gameMap = new Map<string, Player>();

app.use(express.json());

app.post('/instantiateGame', (req, res) => {
    const gameId = req.body['gameId'];
    console.log(`Received game Id ${gameId}`)
    const playerId = req.body['playerId'];
    const gamePlayer = new Player(playerId, gameId);
    gameMap.set(gameId, gamePlayer);
    console.log('Created game and player instance');
    res.sendStatus(200);
});

app.post('/setDealtCards', (req, res) => {
    const gameId = req.body['gameId'];
    const player = gameMap.get(gameId);
    if (player === undefined) {
        console.log('Could not find game set dealt cards');
        res.sendStatus(400);
        return
    }
    const cardsJson = req.body['cards'];
    const cards: Card[] = cardsJson.map((card: any): Card => {
        return new Card(card['suit'], card['rank']);
    });
    player?.setDealtCards(cards);
    console.log(`Received cards ${JSON.stringify(cards)}`);
    res.sendStatus(200);
    return;
});

app.post('/predict', async (req, res) => {
    const gameId = req.body['gameId'];
    const player = gameMap.get(gameId);
    if (player === undefined) {
        console.log('Could not find game prediction');
        res.sendStatus(400);
        return;
    }
    const predictionsJson = req.body['predictions'];
    const predictions: Predictions = {};
    for (const key in predictionsJson) {
        predictions[Number(key)] = Number(predictionsJson[key]);
    }
    const trumpCardJson = req.body['trumpCard'];
    const trumpCard = new Card(trumpCardJson['suit'], trumpCardJson['rank']);
    const prediction = await player?.predict(predictions, trumpCard);
    res.send({
        prediction: prediction,
    });
    return
});

app.post('/playCard', async (req, res) => {
    const gameId = req.body['gameId'];
    const player = gameMap.get(gameId);
    if (player === undefined) {
        console.log('Could not find game play card');
        res.sendStatus(400);
        return;
    }
    const cardsPlayedInOrderJson = req.body['cardsPlayedInOrder'];
    const cardsPlayedInOrder: Card[] = cardsPlayedInOrderJson.map(
        (card: any): Card => {
            return new Card(card['suit'], card['rank']);
        }
    );
    const handsWonByPlayerJson = req.body['handsWonByPlayer'];
    const handsWonByPlayer: HandCounter = {};
    for (const key in handsWonByPlayerJson) {
        handsWonByPlayer[Number(key)] = Number(handsWonByPlayerJson[key]);
    }
    const trumpCardJson = req.body['trumpCard'];
    const trumpCard = new Card(trumpCardJson['suit'], trumpCardJson['rank']);
    const roundPredictionsJson = req.body['roundPredictions'];
    const roundPredictions: Predictions = {};
    for (const key in roundPredictionsJson) {
        roundPredictions[Number(key)] = Number(roundPredictionsJson[key]);
    }
    const playedCard = await player?.playCard(cardsPlayedInOrder, roundPredictions, handsWonByPlayer, trumpCard);
    console.log(playedCard?.toString());
    res.send(playedCard?.toJsonString());
    return;
});

portfinder.getPort((err: any, port: any) => {
    if (err) throw err;
    app.listen(port, () =>
        console.log(`Game bot listening at http://localhost:${port}`)
    );
  });

  
