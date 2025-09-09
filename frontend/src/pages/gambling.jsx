import React, { useState } from "react";
import styles from "../styles/gambling.module.css";
import { base_url } from "../../config";
import { cardNames } from "../utils/cardList";

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function Gambling() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [winner, setWinner] = useState(null);
  const [shuffledCards, setShuffledCards] = useState([]);

  const handleOpen = () => {
    setIsOpen(true);
    const shuffled = shuffle(cardNames);
    setShuffledCards(shuffled);
    const winnerIdx = Math.floor(shuffled.length / 2);
    setWinner(shuffled[winnerIdx]);
    setShowAnimation(true);

    setTimeout(() => {
      setShowAnimation(false);
    }, 2500);
  };

  return (
    <div className={styles.crateContainer}>
      <div className={styles.crateAnimation}>
        <img
          className={`${styles.crateImg} ${
            isOpen ? styles.open : styles.closed
          }`}
          src={
            isOpen
              ? `${base_url}/Chest_open.png`
              : `${base_url}/Chest_closed.png`
          }
          alt={isOpen ? "Åpen kiste" : "Lukket kiste"}
          width={180}
          height={180}
        />
      </div>
      {!isOpen && (
        <button className={styles.crateOpenBtn} onClick={handleOpen}>
          Åpne kiste
        </button>
      )}
      {showAnimation && (
        <div className={styles.scrollAnimation}>
          <div className={styles.cardRow}>
            {shuffledCards.map((name, idx) => (
              <img
                key={idx}
                src={`${base_url}/${name}`}
                alt={name}
                className={styles.scrollCard}
                width={120}
                height={180}
              />
            ))}
          </div>
        </div>
      )}
      {!showAnimation && winner && (
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <h3>Du vant:</h3>
          <img
            src={`${base_url}/${winner}`}
            alt={winner}
            width={180}
            height={270}
            style={{ borderRadius: "12px", boxShadow: "0 2px 12px #0008" }}
          />
          <p>{winner.replace(".png", "")}</p>
        </div>
      )}
    </div>
  );
}

export default Gambling;
