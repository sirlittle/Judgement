import {Card} from './Card';

const suits: string[] = ["hearts", "diamonds", "spades", "clubs"] // Need to fix hardcodingx 
const ranks: string[]  = Array.from(Array(9).keys()).map(i => String(i + 2)).concat(["jack", "queen", "king", "ace"])

export const Hand = ({ cards }) => {
  if (!cards) {
    return <div>loading...</div>;
  }

  return (
    <div className="hand">
      {cards.map( (card) => (
          <Card rank={ranks[card.rank]} suit={suits[card.suit]} key={ranks[card.rank]}/>
      ))}
    </div>
  );
};
  