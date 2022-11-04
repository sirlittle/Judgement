import { RoundResults } from "../../game_server/src/objects/logs";
import { ScoreChart } from "./ScoreChart";

export function RoundResultPage(props: { roundResults: RoundResults }) {
  const roundScore = Object.entries(props.roundResults.roundScore).map(([id, score]) => {
    return { id: id, score: score };
  });
  const logList = props.roundResults.logs.linearLogs;
  return (
    <div>
      <ScoreChart scores={props.roundResults.roundScore} />
      <ol>
        {logList.map((log) => (
          <li>{log}</li>
        ))}
      </ol>
    </div>
  );
}
