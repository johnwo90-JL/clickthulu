import { useState } from "react";
import styles from "../styles/game.module.css";

import { Clicker, Buttons } from "@components/Game/UI/button.jsx";
import MissionsGame from "./gameSubpages/missionsGame";
import StoreGame from "./gameSubpages/storeGame";
import SettingsGame from "./gameSubpages/settingsGame";
import PullsGame from "./gameSubpages/pullsGame";
import WorshippersGame from "./gameSubpages/worshippersGame";
import UpgradesGame from "./gameSubpages/upgradesGame";

const Game = () => {
  const texts = {
    header: "Clickhulu",
    devotions: "Devotions",
    xp: 2468024, // placeholder for experience points
    bp: 1357913, // placeholder for battlepass points
  };

  // Want to keep all game logic inside the game.jsx file/route to simplify data handling.
  // Makes it easier to keep passive income and active abilities instanced without doing a bunch of backend voodoo to keep shit going when in a different "window".
  // Also allows for a complete frontend solution with localstorage for testing purposes and "offline" play.
  // Think this also keeps the entire game in memory so when the slightly longer load time is done it should hopefully be more optimised?
  // Needs to be reworked a bit so it's all "loaded" but conditionally visible through CSS display logic.

  // Menu Flags for conditional HTML rendering. Try to keep only have one set as "true" at a time.
  // Game page. Main game window with links to other pages.
  const [gamePage, setGamePage] = useState(true);
  // Missions page.
  const [missionPage, setMissionPage] = useState(false);
  // Store page.
  const [storePage, setStorePage] = useState(false);
  // Settings page.
  const [settingsPage, setSettingsPage] = useState(false);
  // Pulls page. For spending pull currency and gambling.
  const [pullsPage, setPullsPage] = useState(false);
  // Worshippers page. For managing worshippers.
  const [worshipperPage, setWorshipperPage] = useState(false);
  // Upgrades page. For managing upgrades.
  const [upgradePage, setUpgradePage] = useState(false);
  return (
    <>
      {gamePage && (
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <h3>{texts.header}</h3>
          </div>
          {/* Left Sidebar */}
          <div className={styles.leftBar}>
            <div className={styles.lTop}>
              <Buttons
                label="Missions"
                className={styles.sideButton}
                onClick={() => {
                  setGamePage(!gamePage);
                  setMissionPage(!missionPage);
                }}
              />
              <Buttons
                label="Store"
                className={styles.sideButton}
                onClick={() => {
                  setGamePage(!gamePage);
                  setStorePage(!storePage);
                }}
              />
              <Buttons
                label="Settings"
                className={styles.sideButton}
                onClick={() => {
                  setGamePage(!gamePage);
                  setSettingsPage(!settingsPage);
                }}
              />
            </div>

            <div className={styles.lMiddle}>
              <div className={styles.lmTop}></div>
              <div className={styles.lmBottom}></div>
            </div>

            <div className={styles.lBottom}></div>
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
              <Buttons
                label="Pulls"
                className={styles.sideButton}
                onClick={() => {
                  setGamePage(!gamePage);
                  setPullsPage(!pullsPage);
                }}
              />
            </div>
            <div
              className={styles.rBottom}
              onClick={() => {
                setGamePage(!gamePage);
                setWorshipperPage(!worshipperPage);
              }}
            >
              Placeholder
            </div>
          </div>
        </div>
      )}
      {missionPage && <MissionsGame />}
      {storePage && <StoreGame />}
      {settingsPage && <SettingsGame />}
      {pullsPage && <PullsGame />}
      {worshipperPage && (
        <WorshippersGame
          data={{ gamePage, setGamePage, worshipperPage, setWorshipperPage }}
        />
      )}
      {upgradePage && <UpgradesGame />}
    </>
  );
};

export default Game;
