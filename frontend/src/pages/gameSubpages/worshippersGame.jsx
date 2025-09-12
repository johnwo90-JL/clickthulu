import { Buttons } from "@components/Game/UI/Button.jsx";
import styles from "../../styles/game.module.css";

const WorshippersGame = ({
  data: { gamePage, setGamePage, worshipperPage, setWorshipperPage },
}) => {
  return (
    <>
      <div id="Header">
        <h2>Worshippers</h2>
      </div>
      <div id="Body">
        <div id="LeftUI">
          <Buttons
            label="Back"
            className={styles.sideButton}
            onClick={() => {
              setGamePage(!gamePage);
              setWorshipperPage(!worshipperPage);
            }}
          ></Buttons>
        </div>
        <div id="Content">{/* Put Worshipper cards here */}</div>
      </div>
    </>
  );
};

export default WorshippersGame;
