import  admin  from 'firebase-admin';
import * as dotenv from 'dotenv';
import { GameResult, gameResultToFireBaseObject, roundResultsToFireBaseObject } from   "../objects/logs";


export const writeGamesToDB = async (games: GameResult[]): Promise<string[]> => {
    const db_key_loc = dotenv.config().parsed?.GOOGLE_APPLICATION_CREDENTIALS
    if (!db_key_loc) {
      throw new Error("GOOGLE_APPLICATION_CREDENTIALS not set");
    }   
    const app = admin.initializeApp({
        credential: admin.credential.cert(db_key_loc)
    });
    
    const db = app.firestore();
    
    const batch = db.batch();
    let gamesIds:string[] = [];
    games.forEach((game) => {
        const gameRef = db.collection('games').doc();
        batch.set(gameRef, gameResultToFireBaseObject(game));
        game.roundResults.forEach((round, index) => {
            const roundRef = gameRef.collection('rounds').doc(index.toString());
            batch.set(roundRef, roundResultsToFireBaseObject(round));
            batch.update(roundRef, {roundNumber: index})
        });
        gamesIds.push(gameRef.id);
    });
    
    await batch.commit();
    app.delete();
    return gamesIds
}

export const getGameScore = async (gameId: string): Promise<any> => {
    const db_key_loc = dotenv.config().parsed?.GOOGLE_APPLICATION_CREDENTIALS
    if (!db_key_loc) {
      throw new Error("GOOGLE_APPLICATION_CREDENTIALS not set");
    }   
    const app = admin.initializeApp({
        credential: admin.credential.cert(db_key_loc)
    });
    
    const db = app.firestore();
    
    const gameRef = db.collection('games').doc(gameId);
    const gameDoc = await gameRef.get();
    if (!gameDoc.exists) {
        console.log('No such document!');
    } else {
        console.log('Document data:', gameDoc.data());
    }
    const data =  gameDoc.data();
    app.delete();
    return data;
}

