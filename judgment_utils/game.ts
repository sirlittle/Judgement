import { Card } from "./card";

export type Predictions = { [playerId: number]: number };
export type Hands = { [playerId: number]: Card[] };
export type HandCounter = { [playerId: number]: number };