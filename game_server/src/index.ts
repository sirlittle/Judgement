import { JudgementDeck } from './objects/deck';
import { Card } from 'judgement_utils';
import { runGames } from './game_logic/game';
import { writeGamesToDB, getGameScore, registerBot, getBotData } from './db/games_db';
import express from 'express';
import { Bot} from './objects/bot';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { calculateElo } from './game_logic/elo';

const app = express();
const port = process.env.PORT || (dotenv.config().parsed?.PORT || 8000);
app.use(cors());
app.set('trust proxy', true);
app.post('/game', async (req, res) => {
    console.log(req.query.numberOfGames, req.query.numberOfPlayers);
    const numberOfGames = parseInt(req.query.numberOfGames?.toString() || '1'); // fix this
    const numberOfPlayers = parseInt(
        req.query.numberOfPlayers?.toString() || '5'
    );
    const botIds : string[] = JSON.parse(req.query.playerURLs?.toString() || "[]")   
    const gameResults: string[] = await simulateGames(
        numberOfGames,
        numberOfPlayers,
        botIds
    );
    res.status(200).send(gameResults);
});

app.get('/game/:gameId', (req, res) => {
    /* Get game state */
    const gameId = req.params.gameId
    const gameScore = getGameScore(gameId);
    return gameScore
});

app.post('/createBot', (req, res) => {
    /* Set bot state */
    const botURL = req.body.botURL
    const botDescription = req.body.botDescription
    const botCreator = req.body.botCreator
    const name = req.body.name
    // TODO: do error checking before creating the bot.
    const botId = registerBot(botURL, botDescription, botCreator, name);
    res.status(200).send(botId);
});

app.get('/demoHand', async (req, res) => {
    const demoHand = await getDemoHand();
    res.status(200).send(JSON.stringify(demoHand));
});

app.get('/botRankedList', async (req, res) => {
    const rankedList = await getBotRankedList();
    res.status(200).send(JSON.stringify(rankedList));
});

app.listen(port, () => {
    console.log(`Game server listening at http://localhost:${port}`);
});

export const simulateGames = async (
    numberOfGames: number,
    numberOfPlayers: number,
    botIds: string[] = []
): Promise<string[]> => {
    const botData = await getBotData(botIds);
    while (botData.length < numberOfPlayers) {
        botData.push(new Bot('', '', '', '', '', false));
    }
    const games = await runGames(numberOfGames, numberOfPlayers, botData);
    const gameIds = await writeGamesToDB(games);

    const gameScores = games.map((game) => {
        // game.gamescore is a map of botId to score
        // I want a string list of ordered from highest to lowest score botIds
        const gameScore = game.gameScore;
        const sortedBotIds = Object.keys(gameScore).sort(
            (a, b) => gameScore[b] - gameScore[a]
        );
        return sortedBotIds;
    });
    // Turn the botData above to just objects that id and elo rating and remove all bots that are not remote.
    // Then update the elo rating of the bots based on the gameScores.
    const parsedBots = botData.map((bot) => {
        if (bot.remote) {
            return {
                id: bot.botId,
                elo: bot.eloScore,
            }
        }
    }).filter((bot) => bot !== undefined);
    // for (let i = 0; i < gameScores.length; i++) {
    //     const gameScore = gameScores[i];
    //     const eloScores = calculateElo(parsedBots, gameScore); 

    // }



    // update bot db records to reflect games played
    return gameIds;
};

export const getDemoHand = async (): Promise<Card[]> => {
    let deck = new JudgementDeck();
    return deck.deal(5);
};

const getBotRankedList = async (): Promise<string[]> => {
    // function will call db to get an ordered list of bots.
    return ['bot1', 'bot2', 'bot3', 'bot4', 'bot5'];
}
