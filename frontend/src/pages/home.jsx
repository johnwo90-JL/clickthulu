import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";

const Home = () => {
  return (
    <div className={styles.HomeParent}>
      <div className={styles.Header}>
        <h2>Clickthulu</h2>
      </div>
      <div className={styles.Body}>
        <Link className={styles.PlayButton} to={"/game"}>
          <p className={styles.ButtonText}>Play</p>
        </Link>
        <Link className={styles.AccountButton} to={"/registerandlogin"}>
          <p className={styles.ButtonText}>Login / Account</p>
        </Link>
      </div>
      <div className={styles.Footer}></div>
    </div>
  );
};

export default Home;
