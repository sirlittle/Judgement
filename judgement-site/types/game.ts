// Type definitions for game data
// These mirror the backend types but are defined separately to avoid cross-package imports

export interface Card {
    suit: number;
    rank: number;
    name: string;
}

export type PlayerScores = { [playerId: string]: number };

export interface PredictionLog {
    playerId: string;
    prediction: number;
    cards: Card[];
    trumpCard: Card;
}

export interface PlayActionLog {
    playerId: string;
    cardPlayed: Card;
    handNumber: number;
}

export interface HandWinnerLog {
    handWinnerPlayerId: string;
    handWinnerCard: Card;
    handsCardsInOrder: Card[];
}

export interface RoundResultLog {
    playerId: string;
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
    roundScore: PlayerScores;
    logs: RoundLogs;
}

export interface GameResult {
    roundResults: RoundResults[];
    gameScore: PlayerScores;
}
