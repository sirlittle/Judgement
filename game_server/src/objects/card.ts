
const suits: string[] = ["Hearts", "Diamonds", "Spades", "Clubs"]
const ranks: string[]  = Array.from(Array(9).keys()).map(i => String(i + 2)).concat(["Jack", "Queen", "King", "Ace"])

export class Card {
    suit: number;
    rank: number;
    name: string;

    constructor(suit: number, rank: number) {
        if (suit < 0 || suit > 3 || rank < 0 || rank > 12) {
            throw new Error("Invalid card");
        }
        this.suit = suit;
        this.rank = rank;

        this.name = ranks[rank] + " of " + suits[suit];
    }

    toString() {
        return this.name;
    }
}
