import { Card } from './card';

export type Predictions = { [playerId: string]: number };
export type Hands = { [playerId: string]: Card[] };
export type HandCounter = { [playerId: string]: number };
