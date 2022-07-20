import { Card } from "./card";

export class Deck {
    cards: Card[];

    constructor() {
        this.cards = [];
        for (let suit = 0; suit < 4; suit++) {
            for (let rank = 0; rank < 13; rank++) {
                this.cards.push(new Card(suit, rank));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal(numberOfCardsToDeal: number = 1): Card[] {
        const cardsToDeal = this.cards.splice(0, numberOfCardsToDeal);
        return cardsToDeal;
    }
}

export class JudgementDeck extends Deck {
    trump!: Card;
    constructor() {
        super();
        this.shuffle();
        this.chooseTrump();
    }

    chooseTrump() {
        let potentialTrump = this.deal(1)[0];
        if (!potentialTrump) {
            throw new Error("No cards left in deck");
        }
        this.trump = potentialTrump;
    }

    getTrumpCard() {
        return this.trump;
    }
}




