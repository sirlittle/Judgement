import { RegulatedPlayer } from "./player";
import { Card } from "./card";
import { Predictions, HandCounter } from "./game";
import fetch from 'node-fetch';
import _ from "lodash";
import { cardInHand } from "./utils/hand_utils";

export class RemotePlayer extends RegulatedPlayer {
    // This class will call a remote player to get moves
    // This class will also ensure that all moves and predictions made by remote player are legal

    url: string;

    constructor(url: string, playerId: number, gameId: string) {
        super(playerId, gameId);
        this.url = url;
    }

    async instantiateGame() {
        // Use url to instantiate game on remote player
        await fetch(this.url + '/instantiateGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gameId: this.gameId
            })
        })
    }

    async setDealtCards(cards: Card[]) {
        // Use url to send cards to remote player
        cards.map((card) => this.hand.push(card));
        await fetch(this.url + '/setDealtCards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cards: cards
            })
        })
    }

    async playCard(cardsPlayedInOrder: Card[], handsWonByPlayer: HandCounter, roundPredictions: Predictions, trumpCard: Card) {
        // Use url to get card from remote player, make sure card is within the legal moves and then return it
        const remotePlayerResp = await fetch(this.url + '/playCard', { // need to ensure that the type returned is a card
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cardsPlayedInOrder: cardsPlayedInOrder,
                handsWonByPlayer: handsWonByPlayer,
                roundPredictions: roundPredictions,
                trumpCard: trumpCard
            })
        }).then(
            (response: any) => {
                return response.json() as Promise<{  card: {suit: number, rank: number} }>;
            }
        )
        const cardToPlay = new Card(remotePlayerResp.card.suit, remotePlayerResp.card.rank);

        const legalCards = this.getLegalMoves(cardsPlayedInOrder);
        if (!cardInHand(legalCards, cardToPlay)) { 
            // return a random legal card
            const randomChoice = _.random(0, legalCards.length - 1, false);
            return legalCards[randomChoice];
        }
        return cardToPlay
    }

    async predict(predictions: Predictions, trumpCard: Card): Promise<number> {
        const remotePrediction = await fetch(this.url + '/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                predictions: predictions,
                trumpCard: trumpCard
            })
        }).then(
            (response: any) => {
                return response.json() as Promise<{ data: number }>;
            }
        )
        const prediction = remotePrediction.data;
        // Below is a check to make sure that the player is not making an illegal prediction.
        const numPlayersAlreadyPredicted = Object.keys(predictions).length;
        // sum up all predictions made so far
        const sumOfPredictions = Object.values(predictions).reduce((a, b) => a + b, 0);
        const lastPlayer = numPlayersAlreadyPredicted === this.getNumberOfPlayers() - 1;
        if (sumOfPredictions + prediction == this.getNumOfCards() && lastPlayer) {
          if (prediction > 0) {
            return prediction - 1;
          }
          return prediction + 1;
        }
        return prediction;
      }
}