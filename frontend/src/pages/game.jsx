import styles from "../styles/game.module.css";

import { Clicker, Buttons } from "@components/Game/UI/button.jsx"

const Game = () => {

  const texts = {
    header: "Clickhulu",
    devotions: "Devotions",
    xp: 2468024, // placeholder for experience points
    bp: 1357913, // placeholder for battlepass points
  }
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3>{texts.header}</h3>
      </div>
      {/* Left Sidebar */}
      <div className={styles.leftBar}>
        <div className={styles.lTop}>
          <Buttons label='Missions' className={styles.sideButton}/>
          <Buttons label='Store' className={styles.sideButton}/>
          <Buttons label='Settings' className={styles.sideButton}/>
        </div>

        <div className={styles.lMiddle}>
          <div className={styles.lmTop}>
            
          </div>
          <div className={styles.lmBottom}>
              
          </div>
        </div>

        <div className={styles.lBottom}>

        </div>
      </div>
      {/* Middle Section */}
      <div className={styles.middle}>
        <div className={styles.mTop}>
          <div className={styles.xp}>
            <p>{texts.xp} XP</p>
          </div>
          <div className={styles.bp}>
            <p>{texts.bp} BP</p>
          </div>
        </div>
        <div className={styles.mBottom}>
          <h3>{texts.devotions}</h3>
          <Clicker />
        </div>
      </div>
      {/* Right Sidebar */}
      <div className={styles.rightBar}>
        <div className={styles.rTop}>
          <Buttons label='Pulls' className={styles.sideButton}/>
        </div>
        <div className={styles.rBottom}>

        </div>
      </div>
    </div>
  );
};

export default Game;
