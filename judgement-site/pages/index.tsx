import useSWR from "swr";
import styles from '../styles/Home.module.css'

import { Hand } from '../components/Hand';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function MainPage() {
  const { data, error } = useSWR(`${API_URL}/demoHand`, fetcher);
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
