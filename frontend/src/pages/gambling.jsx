import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/gambling.module.css";
import cardStyles from "../styles/card.module.css";
import { base_url } from "../../config";
import { cardNames } from "../utils/cardList";

// Konstanter for animasjon og scroll
const SCROLL_CARD_WIDTH = 136;
const ANIMATION_TIME = 10000; // ms
const COOLDOWN_TIME = 15000; // ms
const ADS = [
  "/clickhulu/ads/sayno.mp4",
  "/clickhulu/ads/saul.mp4",
  "/clickhulu/ads/doritos.mp4",
  "/clickhulu/ads/3ms.mp4",
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

  // Timeout refs for cleanup
  const timeouts = useRef([]);
  const containerRef = useRef(); // Ny ref for scrollAnimation-container

  // Full reset (alt til start)
  const resetAll = () => {
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

  // Reset kun for nytt spill (beholder canOpen=false)
  const resetForNewGame = () => {
    setIsOpen(false);
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

  // Cooldown-timer
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
        resetAll();
      }, COOLDOWN_TIME);
      return () => {
        clearTimeout(timeoutId);
        clearInterval(timerId);
      };
    } else {
      setCooldownLeft(0);
    }
  }, [winner, showAnimation, showAd]);

  // Cleanup for timeouts når komponenten unmountes
  useEffect(() => {
    return () => {
      timeouts.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Hovedfunksjon for å åpne kista
  const handleOpen = () => {
    if (!canOpen) return;
    resetForNewGame();
    setIsOpen(true);
    setCanOpen(false);

    // Velg vinner
    const winnerCard = pickWinnerCard(cardNames);

    // Lag spinner-array med kun unike kort
    const uniqueCards = Array.from(new Set(cardNames));
    const spinner = Array(20)
      .fill(null)
      .flatMap(() => shuffle(uniqueCards));

    // Sett vinnerkortet i midten
    const middleIdx = Math.floor(spinner.length / 2);
    spinner[middleIdx] = winnerCard;

    setWinnerIdx(middleIdx);
    setShuffledCards(spinner);
    setShowAnimation(true);

    // Start animasjon
    timeouts.current.push(
      setTimeout(() => {
        setIsScrolling(true);
        const containerWidth = containerRef.current
          ? containerRef.current.offsetWidth
          : 900;
        const scrollOffset = containerWidth / 2 - SCROLL_CARD_WIDTH / 2;
        setScrollPos(middleIdx * SCROLL_CARD_WIDTH - scrollOffset);
      }, 50)
    );

    // Ferdig etter animasjon
    timeouts.current.push(
      setTimeout(() => {
        setShowAnimation(false);
        setIsScrolling(false);
        setIsDropping(true);
        setCanOpen(true); // Ad er deaktivert
      }, ANIMATION_TIME)
    );
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
          <div className={styles.scrollAnimation} ref={containerRef}>
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
                  key={`${name}-${idx}`}
                  src={`${base_url}/${name}`}
                  alt={`Kort: ${name.replace(".png", "")}`}
                  className={styles.scrollCard}
                  width={SCROLL_CARD_WIDTH}
                  height={SCROLL_CARD_WIDTH * 1.5}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vinnerkort og ad-overlay */}
      {!showAnimation &&
        shuffledCards.length > 0 &&
        winnerIdx !== null &&
        !showAd && (
          <div
            style={{
              marginTop: "32px",
              minHeight: "250px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              marginBottom: "48px",
            }}
          >
            <h3>Du vant:</h3>
            {(() => {
              const actualWinner = shuffledCards[winnerIdx];
              let rarity = "common";
              if (actualWinner.includes("epic")) rarity = "epic";
              else if (actualWinner.includes("uncommon")) rarity = "uncommon";
              return (
                <div
                  className={`${cardStyles.cardItem} ${cardStyles[rarity]} ${
                    isDropping ? styles.dropCard : ""
                  }`}
                  style={{ marginBottom: canOpen ? "24px" : "0" }}
                >
                  <img
                    src={`${base_url}/${actualWinner}`}
                    alt={`Vinnerkort: ${actualWinner.replace(".png", "")}`}
                    width={150}
                    height={225}
                  />
                </div>
              );
            })()}
            <p>{shuffledCards[winnerIdx].replace(".png", "")}</p>
          </div>
        )}

      {/* Cooldown-timer */}
      {!showAnimation && winner && cooldownLeft > 0 && (
        <div
          style={{
            marginBottom: "24px",
            color: "#000000",
            fontWeight: "bold",
            fontSize: "1.3rem",
          }}
        >
          Cooldown: {cooldownLeft}s
        </div>
      )}

      {/* Åpne-knapp */}
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
                setCanOpen(true);
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
