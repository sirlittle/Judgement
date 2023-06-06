import useSWR from "swr";
import styles from '../styles/Home.module.css'

import { Hand } from '../components/Hand';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MainPage() {
  // const { data, error } = useSWR('https://localhost:8080', fetcher)
  const { data, error } = useSWR("http://localhost:8080/demoHand", fetcher);
  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }
  return (
      <div className={styles.main}>
        {/* <Button variant="contained" color="primary">Click To Simulate</Button> */}
        <Hand cards={data}/>
        {/* <GameResults data={data}/> */}
      </div>
  );
}
