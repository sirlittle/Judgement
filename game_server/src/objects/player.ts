import { randomBytes } from "crypto";
import { Card } from "./card";
import _ from "lodash";

// This will be class that defines all player available actions
export class RegulatedPlayer {
  id: number;
  hand: Card[];
  otherPlayerIds: number[];

  constructor(id: number) {
    this.id = id;
    this.hand = [];
    this.otherPlayerIds = [];
  }

  getAllPlayer(ids: number[]){
    this.otherPlayerIds = ids;
  }

  getDealtCards(cards: Card[]) {
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

  playCard(cardsPlayedInOrder: Card[], trumpCard: Card) {
    const legalCards = this.getLegalMoves(cardsPlayedInOrder);
    const randomChoice = _.random(0, legalCards.length - 1, false);
    const cardToPlay = legalCards[randomChoice];
    const indexToPopOff = this.hand.findIndex((card) => card === cardToPlay);
    return this.hand.splice(indexToPopOff, 1)[0];
  }

  // Logic for this is broken, pass in Predictions So Far and Trump Card only.
  predict(numCards: number, numLeft: number, trumpCard: Card, last: boolean = false): number {
    let prediction = _.random(0, numCards, false);
    if (last && prediction === numLeft) {
      prediction = prediction + [-1, 1][_.random(0, 1, false)];
    }
    return prediction;
  }
}

export class Player extends RegulatedPlayer {
  playCard(cardsPlayedInOrder: Card[], trumpCard: Card) {
    const legalCards = this.getLegalMoves(cardsPlayedInOrder);
    const randomChoice = _.random(0, legalCards.length - 1, false);
    const cardToPlay = legalCards[randomChoice];
    const indexToPopOff = this.hand.findIndex((card) => card === cardToPlay);
    return this.hand.splice(indexToPopOff, 1)[0];
  }

  // Logic for this is broken, pass in Predictions So Far and Trump Card only.
  predict(numCards: number, numLeft: number, trumpCard: Card, last: boolean = false): number {
    let prediction = _.random(0, numCards, false);
    if (last && prediction === numLeft) {
      prediction = prediction + [-1, 1][_.random(0, 1, false)];
    }
    return prediction;
  }
}
