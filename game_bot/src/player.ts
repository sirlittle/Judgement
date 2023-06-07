import { Card, Predictions, HandCounter } from "judgement_utils";
import _ from "lodash";

// This will be class that defines all player available actions
export class RegulatedPlayer {
  playerId: number;
  hand: Card[];
  otherPlayerIds: number[];
  gameId: string;

  constructor(playerId: number, gameId: string) {
    this.playerId = playerId;
    this.hand = [];
    this.otherPlayerIds = [];
    this.gameId = gameId;
  }

  getNumOfCards(): number {
    return this.hand.length;
  }

  getAllPlayer(ids: number[]){
    this.otherPlayerIds = ids;
  }

  getNumberOfPlayers(): number {
    return this.otherPlayerIds.length + 1;
  }

  async setDealtCards(cards: Card[]) {
    cards.map((card) => this.hand.push(card));
  }

  getLegalMoves(cardsPlayedInOrder: Card[]): Card[] {
    if (cardsPlayedInOrder.length === 0) {
      return this.hand;
    }
    const firstSuit = cardsPlayedInOrder[0].suit;
    let legalCards = this.hand.filter((card) => card.suit === firstSuit);
    if (legalCards.length === 0) {
      return this.hand;
    }
    return legalCards;
  }

  async playCard(cardsPlayedInOrder: Card[], handsWonByPlayer: HandCounter, roundPredictions: Predictions, trumpCard: Card): Promise<Card> {
    const legalCards = this.getLegalMoves(cardsPlayedInOrder);
    const randomChoice = _.random(0, legalCards.length - 1, false);
    const cardToPlay = legalCards[randomChoice];
    const indexToPopOff = this.hand.findIndex((card) => card === cardToPlay);
    return this.hand.splice(indexToPopOff, 1)[0];
  }

  async predict(predictions: Predictions, trumpCard: Card): Promise<number> {
    let prediction = _.random(0, this.getNumOfCards(), false);
    // get number of keys in predictions
    const numPlayersAlreadyPredicted = Object.keys(predictions).length;
    // sum up all predictions made so far
    const sumOfPredictions = Object.values(predictions).reduce((a, b) => a + b, 0);
    const lastPlayer = numPlayersAlreadyPredicted === this.getNumberOfPlayers() - 1;
    if (sumOfPredictions + prediction == this.getNumOfCards() && lastPlayer) {
      return await this.predict(predictions, trumpCard);
    }
    return prediction;
  }

  async setHandResult(handInOrder: Card[], handWinnerId: number) {
    return;
  }
}
export class Player extends RegulatedPlayer {
  async playCard(cardsPlayedInOrder: Card[], handsWonByPlayer: HandCounter, roundPredictions: Predictions, trumpCard: Card): Promise<Card> {
    const legalCards = this.getLegalMoves(cardsPlayedInOrder);
    const randomChoice = _.random(0, legalCards.length - 1, false);
    const cardToPlay = legalCards[randomChoice];
    const indexToPopOff = this.hand.findIndex((card) => card === cardToPlay);
    return this.hand.splice(indexToPopOff, 1)[0];
  }

  // Logic for this is broken, pass in Predictions So Far and Trump Card only.
  async predict(predictions: Predictions, trumpCard: Card): Promise<number> {
    let prediction = _.random(0, this.getNumOfCards(), false);
    // get number of keys in predictions
    const numPlayersAlreadyPredicted = Object.keys(predictions).length;
    // sum up all predictions made so far
    const sumOfPredictions = Object.values(predictions).reduce((a, b) => a + b, 0);
    const lastPlayer = numPlayersAlreadyPredicted === this.getNumberOfPlayers() - 1;
    if (sumOfPredictions + prediction == this.getNumOfCards() && lastPlayer) {
      return await this.predict(predictions, trumpCard);
    }
    return prediction;
  }
}
