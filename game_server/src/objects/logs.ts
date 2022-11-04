import { Card } from "./card";

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
