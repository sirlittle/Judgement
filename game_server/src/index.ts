import type { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import { JudgementDeck } from './objects/deck';
import { Card } from 'judgement_utils';
import { runGames } from './game_logic/game';
import { writeGamesToDB, getGameScore } from './db/games_db';
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

const app = express();
const port = dotenv.config().parsed?.PORT || 8000;
app.use(cors());
app.post('/game', async (req, res) => {
    console.log(req.query.numberOfGames, req.query.numberOfPlayers);
    const numberOfGames = parseInt(req.query.numberOfGames?.toString() || '1'); // fix this
    const numberOfPlayers = parseInt(
        req.query.numberOfPlayers?.toString() || '5'
    );
    const gameResults: string[] = await simulateGames(
        numberOfGames,
        numberOfPlayers
    );
    res.status(200).send(gameResults);
});

app.get('/game/:gameId', (req, res) => {
    console.log(req.params.gameId);
});

app.get('/demoHand', async (req, res) => {
    const demoHand = await getDemoHand();
    res.status(200).send(JSON.stringify(demoHand));
});

app.post('/game/:gameId/move', (req, res) => {
    /* Make a move */
});

app.listen(port, () => {
    console.log(`Game server listening at http://localhost:${port}`);
});

// function only for local testing. In reality, all actual functions will be deployed as seperate cloud functions
// Outdated, deploy as running server instead
export const index: HttpFunction = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');

    if (req.method === 'OPTIONS') {
        // stop preflight requests here
        res.status(204).send('');
        return;
    }
    switch (req.path) {
        case '/simulateGames':
            console.log(req.query.numberOfGames, req.query.numberOfPlayers);
            const numberOfGames = parseInt(
                req.query.numberOfGames?.toString() || '1'
            ); // fix this
            const numberOfPlayers = parseInt(
                req.query.numberOfPlayers?.toString() || '5'
            );
            const gameResults: string[] = await simulateGames(
                numberOfGames,
                numberOfPlayers
            );
            res.status(200).send(gameResults);
            break;
        case '/getDemoHand':
            const demoHand = await getDemoHand();
            res.status(200).send(JSON.stringify(demoHand));
            break;
        case '/getGameScore':
            const gameInfo = await getGameScore(
                req.query.gameId?.toString() || ''
            );
            res.status(200).send(JSON.stringify(gameInfo));
        default:
            res.status(404).send('Not Found');
    }
};

export const simulateGames = async (
    numberOfGames: number,
    numberOfPlayers: number
): Promise<string[]> => {
    const games = await runGames(numberOfGames, numberOfPlayers);
    const gameIds = await writeGamesToDB(games);
    return gameIds;
};

export const getDemoHand = async (): Promise<Card[]> => {
    let deck = new JudgementDeck();
    return deck.deal(5);
};
