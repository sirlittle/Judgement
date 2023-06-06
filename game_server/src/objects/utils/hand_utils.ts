import {Card} from "../card";

export function cardInHand(hand: Card[], card: Card): boolean {
    return hand.some((c) => c.equals(card));
}