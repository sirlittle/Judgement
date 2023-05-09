import { GameResult } from "../../game_server/src/objects/logs";
import ScrollingTabs from "./ScrollingTabs";
import { ScoreChart } from "./ScoreChart";
export function GameResults({data}) {
  // The data that is sent is sent back from the server is an array where each element is a single games results.
  // We need to massage the data into something meaningful for VictoryChart.
  // iterate through all elements of { [id: number]: number };
  if (!data) {
    return <div>loading...</div>;
  }
  const firstGameResults: GameResult = data[0];
  // Find highest number in gameScore
  const gameScoreArray = Object.values(firstGameResults.gameScore);

  // ordered list of log list
  return (
    // Center the content
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold">Game Results</h1>
      <ScoreChart scores={gameScoreArray} />
      <h1 className="text-6xl font-bold">Round Results</h1>
      <ScrollingTabs gameResults={firstGameResults}></ScrollingTabs>
    </div>
  );
}
