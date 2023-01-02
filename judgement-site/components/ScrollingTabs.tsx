import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { GameResult } from "../../game_server/src/objects/logs";
import { RoundResultPage } from "./RoundResultPage";

export default function ScrollableTabData(props: { gameResults: GameResult }) {
  const [round, setRound] = React.useState(0);

  const handleRoundChange = (event: React.SyntheticEvent, newround: number) => {
    setRound(newround);
  };
  let roundData = props.gameResults.roundResults[round];
  return (
    <div>
      <Tabs value={round} onChange={handleRoundChange} variant="scrollable" aria-label="scrollable auto tabs">
        {props.gameResults.roundResults.map((_, index) => (
          <Tab label={index} />
        ))}
      </Tabs>
      <RoundResultPage roundResults={roundData} />
    </div>
  );
}
