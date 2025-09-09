import React, { useState } from "react";
import styles from "../styles/gambling.module.css";
import cardStyles from "../styles/card.module.css";
import { base_url } from "../../config";
import { cardNames } from "../utils/cardList";

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function pickWinnerCard(cards) {
  // Del opp i rarity
  const epic = cards.filter((c) => c.includes("epic"));
  const uncommon = cards.filter((c) => c.includes("uncommon"));
  const common = cards.filter((c) => c.includes("common"));
  const rand = Math.random();
  if (rand < 0.05 && epic.length > 0) {
    // 5% sjanse epic
    return epic[Math.floor(Math.random() * epic.length)];
  } else if (rand < 0.25 && uncommon.length > 0) {
    // 20% sjanse uncommon
    return uncommon[Math.floor(Math.random() * uncommon.length)];
  } else {
    // 75% sjanse common
    return common[Math.floor(Math.random() * common.length)];
  }
}

function Gambling() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerIdx, setWinnerIdx] = useState(null);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [scrollPos, setScrollPos] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [canOpen, setCanOpen] = useState(true);

  const handleOpen = () => {
    if (!canOpen) return;
    setIsOpen(true);
    setCanOpen(false);
    // Lag uendelig scroll: dupliser kortene mange ganger
    const repeated = Array(20)
      .fill(null)
      .flatMap(() => shuffle(cardNames));
    setShuffledCards(repeated);
    // Velg vinner med rarity-sjanse
    const winnerCard = pickWinnerCard(cardNames);
    // Finn første index av vinnerkortet i midten av repeated
    const mid = Math.floor(repeated.length / 2);
    const idx =
      repeated
        .slice(mid, mid + cardNames.length)
        .findIndex((c) => c === winnerCard) + mid;
    setWinnerIdx(idx);
    setWinner(repeated[idx]);
    setShowAnimation(true);
    setScrollPos(0); // start scroll-posisjon
    setIsScrolling(false);

    // Start animasjon etter kort delay
    setTimeout(() => {
      setIsScrolling(true);
      setScrollPos(idx * 136 - 240); // scroll til vinnerposisjon
    }, 50);

    // Skjul animasjon etter 10s (pause etter scroll)
    setTimeout(() => {
      setShowAnimation(false);
      setIsScrolling(false);
    }, 10000);

    // Tillat ny crate etter 5 sekunder
    setTimeout(() => {
      setIsOpen(false);
      setCanOpen(true);
      setWinner(null);
    }, 15000);
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
      {!isOpen && canOpen && (
        <button className={styles.crateOpenBtn} onClick={handleOpen}>
          Åpne kiste
        </button>
      )}
      {showAnimation && (
        <div className={styles.scrollAnimation}>
          <div
            className={styles.cardRow}
            style={{
              transform: `translateX(-${scrollPos}px)`,
              transition: isScrolling
                ? "transform 10s cubic-bezier(0.1,0.8,0.1,1)"
                : "none",
            }}
          >
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
          {(() => {
            let rarity = "common";
            if (winner.includes("epic")) rarity = "epic";
            else if (winner.includes("uncommon")) rarity = "uncommon";
            return (
              <div className={`${cardStyles.cardItem} ${cardStyles[rarity]}`}>
                <img
                  src={`${base_url}/${winner}`}
                  alt={winner}
                  width={150}
                  height={225}
                />
              </div>
            );
          })()}
          <p>{winner.replace(".png", "")}</p>
        </div>
      )}
    </div>
  );
}

export default Gambling;