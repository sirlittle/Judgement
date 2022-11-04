import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from "victory";

export function ScoreChart(props: { scores: number[] }) {
  const scoreArray = Object.values(props.scores);
  const scoreMax = Math.max(...scoreArray);
  const gameData = Object.entries(scoreArray).map(([id, score]) => {
    return { id: id, score: score };
  });

  return (
    <VictoryChart width={350} theme={VictoryTheme.material} domainPadding={20}>
      <VictoryAxis
        tickValues={[0, 1, 2, 3, 4]}
        tickFormat={["Player 1", "Player 2", "Player 3", "Player 4", "Player 5"]}
      />
      <VictoryAxis dependentAxis domain={{ x: [0, 5], y: [0, Math.max(60, scoreMax)] }} />

      <VictoryBar labels={({ datum }) => `${datum.score}`} data={gameData} x="id" y="score" />
    </VictoryChart>
  );
}
