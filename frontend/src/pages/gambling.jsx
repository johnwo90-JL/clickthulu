import React, { useState, useEffect } from "react";
import styles from "../styles/gambling.module.css";
import cardStyles from "../styles/card.module.css";
import { base_url } from "../../config";
import { cardNames } from "../utils/cardList";

// Konstanter for animasjon og scroll
const SCROLL_CARD_WIDTH = 136;
const SCROLL_OFFSET = 240;
const ANIMATION_TIME = 10000; // ms
const COOLDOWN_TIME = 15000; // ms
const ADS = [
  "/clickhulu/ads/sayno.mp4",
  "/clickhulu/ads/saul.mp4",
  "/clickhulu/ads/doritos.mp4",
  "/clickhulu/ads/3ms.mp4",
  // Legg til flere ads her
];

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function pickWinnerCard(cards) {
  const epic = cards.filter((c) => c.includes("epic"));
  const uncommon = cards.filter((c) => c.includes("uncommon"));
  const common = cards.filter((c) => c.includes("common"));
  const rand = Math.random();
  if (rand < 0.05 && epic.length > 0) {
    return epic[Math.floor(Math.random() * epic.length)];
  } else if (rand < 0.25 && uncommon.length > 0) {
    return uncommon[Math.floor(Math.random() * uncommon.length)];
  } else {
    return common[Math.floor(Math.random() * common.length)];
  }
}

function Gambling() {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerIdx, setWinnerIdx] = useState(null);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [scrollPos, setScrollPos] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [canOpen, setCanOpen] = useState(true);
  const [isDropping, setIsDropping] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [adError, setAdError] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  // Reset all state to start
  const resetState = () => {
    setIsOpen(false);
    setCanOpen(true);
    setWinner(null);
    setWinnerIdx(null);
    setShuffledCards([]);
    setScrollPos(0);
    setIsScrolling(false);
    setIsDropping(false);
    setShowAd(false);
    setCurrentAd(null);
    setAdError(false);
    setAdLoading(false);
  };

  // Cooldown-timer: reset kun hvis vinner er synlig og ingen ad vises
  useEffect(() => {
    let timerId;
    if (winner && !showAnimation && !showAd) {
      setCooldownLeft(COOLDOWN_TIME / 1000);
      timerId = setInterval(() => {
        setCooldownLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      const timeoutId = setTimeout(() => {
        resetState();
      }, COOLDOWN_TIME);
      return () => {
        clearTimeout(timeoutId);
        clearInterval(timerId);
      };
    } else {
      setCooldownLeft(0);
    }
  }, [winner, showAnimation, showAd]);

  // Hovedfunksjon for å åpne kista
  const handleOpen = () => {
    if (!canOpen) return;
    resetState();
    setIsOpen(true);
    setCanOpen(false);
    // Lag uendelig scroll: dupliser kortene mange ganger
    const repeated = Array(20)
      .fill(null)
      .flatMap(() => shuffle(cardNames));
    setShuffledCards(repeated);
    // Velg vinner
    const winnerCard = pickWinnerCard(cardNames);
    setWinner(winnerCard);
    // Finn første index av vinnerkortet i midten
    const middleStart = Math.floor(repeated.length / 2);
    const idx = repeated.indexOf(winnerCard, middleStart);
    setWinnerIdx(idx);
    setShowAnimation(true);
    // Start animasjon
    setTimeout(() => {
      setIsScrolling(true);
      setScrollPos(idx * SCROLL_CARD_WIDTH - SCROLL_OFFSET);
    }, 50);
    // Ferdig etter animasjon
    setTimeout(() => {
      setShowAnimation(false);
      setIsScrolling(false);
      setIsDropping(true);
      // 50% sjanse for reklame
      if (Math.random() < 0.9 && ADS.length > 0) {
        setCurrentAd(ADS[Math.floor(Math.random() * ADS.length)]);
        setShowAd(true);
        setAdLoading(true);
        setAdError(false);
      }
    }, ANIMATION_TIME);
  };

  // Responsiv video-style
  const videoStyle = {
    width: "90vw",
    maxWidth: "900px",
    height: "auto",
    borderRadius: "18px",
    boxShadow: "0 2px 24px #000a",
    background: "#000",
  };

  return (
    <div className={styles.crateContainer}>
      <div className={styles.crateBackground}></div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          marginTop: "0",
        }}
      >
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
            width={260}
            height={260}
          />
        </div>
        {showAnimation && (
          <div className={styles.scrollAnimation}>
            <div className={styles.scrollMarker}></div>
            <div
              className={styles.cardRow}
              style={{
                transform: `translateX(-${scrollPos}px)`,
                transition: isScrolling
                  ? `transform ${
                      ANIMATION_TIME / 1000
                    }s cubic-bezier(0.1,0.8,0.1,1)`
                  : "none",
              }}
            >
              {shuffledCards.map((name, idx) => (
                <img
                  key={idx}
                  src={`${base_url}/${name}`}
                  alt={name}
                  className={styles.scrollCard}
                  width={180}
                  height={270}
                  aria-label={`Kort: ${name}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Vinnerkort og ad-overlay */}
      {!showAnimation && winner && !showAd && (
        <div
          style={{
            marginTop: "32px",
            minHeight: "250px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: "48px", // Ekstra plass under vinnerkortet
          }}
        >
          <h3>Du vant:</h3>
          {(() => {
            let rarity = "common";
            if (winner.includes("epic")) rarity = "epic";
            else if (winner.includes("uncommon")) rarity = "uncommon";
            return (
              <div
                className={`${cardStyles.cardItem} ${cardStyles[rarity]} ${
                  isDropping ? styles.dropCard : ""
                }`}
                style={{ marginBottom: canOpen ? "24px" : "0" }}
              >
                <img
                  src={`${base_url}/${winner}`}
                  alt={winner}
                  width={150}
                  height={225}
                  aria-label={`Vinnerkort: ${winner}`}
                />
              </div>
            );
          })()}
          <p>{winner.replace(".png", "")}</p>
        </div>
      )}
      {/* Cooldown-timer vises alltid når cooldown er aktiv og vinner finnes */}
      {!showAnimation && winner && cooldownLeft > 0 && (
        <div
          style={{
            marginBottom: "24px",
            color: "#000000",
            fontWeight: "bold",
            fontSize: "2.2rem",
          }}
        >
          Cooldown: {cooldownLeft}s
        </div>
      )}
      {/* Åpne-knapp kun når cooldown er ferdig og ikke ad vises */}
      {!isOpen && canOpen && cooldownLeft === 0 && !showAd && (
        <button
          className={styles.crateOpenBtn}
          onClick={handleOpen}
          aria-label="Åpne kiste"
          style={{ marginTop: "120px", marginBottom: "48px" }}
        >
          Åpne kiste
        </button>
      )}
      {/* Ad-overlay */}
      {showAd && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Reklame-overlay"
        >
          {adLoading && !adError && (
            <div style={{ color: "#fff", marginBottom: "16px" }}>
              Laster reklame...
            </div>
          )}
          {adError && (
            <div style={{ color: "#f00", marginBottom: "16px" }}>
              Kunne ikke spille av reklame
            </div>
          )}
          {currentAd && (
            <video
              src={currentAd}
              style={videoStyle}
              autoPlay
              muted={false}
              aria-label="Reklamevideo"
              onPlay={() => setAdLoading(false)}
              onError={() => setAdError(true)}
              onEnded={() => {
                setShowAd(false);
                setCurrentAd(null);
                setAdError(false);
                setAdLoading(false);
                setCanOpen(true); // Vis åpne-knapp igjen
              }}
            />
          )}
          <p style={{ color: "#fff", fontSize: "1.5rem", marginTop: "16px" }}>
            Reklame
          </p>
        </div>
      )}
    </div>
  );
}

export default Gambling;