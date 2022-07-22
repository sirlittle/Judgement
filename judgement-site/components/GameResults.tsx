import useSWR from 'swr'
import { VictoryBar, VictoryChart } from 'victory';


const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function GameResults(props) {
  const { data, error } = useSWR('http://localhost:8080', fetcher)
  if (error){
    return <div>{JSON.stringify(error)}</div>
  }
    
  if (!data){
    return <div>loading...</div>
  }
  // The data that is sent is sent back from the server is an array where each element is a single games results.
  // We need to massage the data into something meaningful for VictoryChart.
  let gameLogs = data.map((gameResult) => {gameResult.linearLog})
  return 
  (
    <VictoryChart>
      <VictoryBar data={data}/>
    </VictoryChart>
  )

}
