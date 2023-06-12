import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import {
    GameResult,
    gameResultToFireBaseObject,
    roundResultsToFireBaseObject,
} from '../objects/logs';
import { Bot } from '../objects/bot';

const getDb = () => {
    const db_key_loc = dotenv.config().parsed?.GOOGLE_APPLICATION_CREDENTIALS;
    let cred = admin.credential.applicationDefault();
    if (db_key_loc) {
        console.log('GOOGLE_APPLICATION_CREDENTIALS is set');
        cred = admin.credential.cert(db_key_loc);
    }
    const app = admin.initializeApp({
        credential: cred,
    });
    const db = app.firestore();
    return { db, app };
};

export const writeGamesToDB = async (
    games: GameResult[]
): Promise<string[]> => {
    const { db, app } = getDb();
    const batch = db.batch();
    let gamesIds: string[] = [];
    games.forEach((game) => {
        const gameRef = db.collection('games').doc();
        batch.set(gameRef, gameResultToFireBaseObject(game));
        game.roundResults.forEach((round, index) => {
            const roundRef = gameRef.collection('rounds').doc(index.toString());
            batch.set(roundRef, roundResultsToFireBaseObject(round));
            batch.update(roundRef, { roundNumber: index });
        });
        gamesIds.push(gameRef.id);
    });

    await batch.commit();
    app.delete();
    return gamesIds;
};

export const getBotData = async (botIds: string[]): Promise<Bot[]> => {
    const { db, app } = getDb();
    const botsRef = db.collection('bots');
    const botsSnapshot = await botsRef.get();
    let botData: Bot[] = [];
    botsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (botIds.includes(doc.id)) {
            botData.push(
                new Bot(
                    doc.id,
                    data.botUrl,
                    data.botDescription,
                    data.creator,
                    data.botName,
                    true,
                    data.numberOfGamesWon,
                    data.numberOfGamesPlayed,
                    data.eloScore,
                )
            );
        }
    });
    app.delete();
    return botData;
};

export const registerBot = async (
    botUrl: string,
    botDescription: string,
    creator: string,
    botName: string
): Promise<string> => {
    const { db, app } = getDb();

    // search through all bots, see if url already used:
    const allBotsRef = db.collection('bots');
    const botsSnapshot = await allBotsRef.get();
    botsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.botUrl === botUrl) {
            throw new Error('Bot URL already registered');
        }
    });

    const botRef = db.collection('bots').doc();
    await botRef.set({
        botUrl: botUrl,
        botDescription: botDescription,
        creator: creator,
        botName: botName,
        numberOfGamesWon: 0,
        numberOfGamesPlayed: 0,
        eloScore: 1500,
    });

    app.delete();
    return botRef.id;
};

export const getGameScore = async (gameId: string): Promise<any> => {
    const { db, app } = getDb();
    const gameRef = db.collection('games').doc(gameId);
    const gameDoc = await gameRef.get();
    if (!gameDoc.exists) {
        console.log('No such document!');
    } else {
        console.log('Document data:', gameDoc.data());
    }
    const data = gameDoc.data();
    app.delete();
    return data;
};
