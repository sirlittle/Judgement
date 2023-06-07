import { Card } from 'judgement_utils';

export interface PredictionLog {
    playerId: number;
    prediction: number;
    cards: Card[];
    trumpCard: Card;
}

export interface PlayActionLog {
    playerId: number;
    cardPlayed: Card;
    handNumber: number;
}

export interface HandWinnerLog {
    handWinnerPlayerId: number;
    handWinnerCard: Card;
    handsCardsInOrder: Card[];
}

export interface RoundResultLog {
    playerId: number;
    prediction: number;
    actual: number;
    scoreAdded: number;
    originalHand: Card[];
}

export interface RoundLogs {
    predictionInfo: PredictionLog[];
    playActionInfo: PlayActionLog[];
    handWinnerInfo: HandWinnerLog[];
    roundResultInfo: RoundResultLog[];
    linearLogs: string[];
}

export interface RoundResults {
    roundScore: number[];
    logs: RoundLogs;
}

export interface GameResult {
    roundResults: RoundResults[];
    gameScore: number[];
}

export const gameResultToFireBaseObject = (gameResult: GameResult): any => {
    return {
        gameScore: gameResult.gameScore,
    };
};

export const roundResultsToFireBaseObject = (
    roundResults: RoundResults
): any => {
    return {
        roundScore: roundResults.roundScore,
        logs: roundLogsToFireBaseObject(roundResults.logs),
    };
};

export const roundLogsToFireBaseObject = (roundLogs: RoundLogs): any => {
    return {
        predictionInfo: roundLogs.predictionInfo.map(
            predictionLogToFireBaseObject
        ),
        playActionInfo: roundLogs.playActionInfo.map(
            playActionLogToFireBaseObject
        ),
        handWinnerInfo: roundLogs.handWinnerInfo.map(
            handWinnerLogToFireBaseObject
        ),
        roundResultInfo: roundLogs.roundResultInfo.map(
            roundResultLogToFireBaseObject
        ),
        linearLogs: roundLogs.linearLogs,
    };
};

export const predictionLogToFireBaseObject = (
    predictionLog: PredictionLog
): any => {
    return {
        playerId: predictionLog.playerId,
        prediction: predictionLog.prediction,
        cards: predictionLog.cards.map((card) => card.toFirebaseObject()),
        trumpCard: predictionLog.trumpCard.toFirebaseObject(),
    };
};

export const playActionLogToFireBaseObject = (
    playActionLog: PlayActionLog
): any => {
    return {
        playerId: playActionLog.playerId,
        cardPlayed: playActionLog.cardPlayed.toFirebaseObject(),
        handNumber: playActionLog.handNumber,
    };
};

export const handWinnerLogToFireBaseObject = (
    handWinnerLog: HandWinnerLog
): any => {
    return {
        handWinnerPlayerId: handWinnerLog.handWinnerPlayerId,
        handWinnerCard: handWinnerLog.handWinnerCard.toFirebaseObject(),
        handsCardsInOrder: handWinnerLog.handsCardsInOrder.map((card) =>
            card.toFirebaseObject()
        ),
    };
};

export const roundResultLogToFireBaseObject = (
    roundResultLog: RoundResultLog
): any => {
    return {
        playerId: roundResultLog.playerId,
        prediction: roundResultLog.prediction,
        actual: roundResultLog.actual,
        scoreAdded: roundResultLog.scoreAdded,
        originalHand: roundResultLog.originalHand.map((card) =>
            card.toFirebaseObject()
        ),
    };
};
