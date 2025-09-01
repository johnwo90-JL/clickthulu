import React, { useRef } from "react";
import styles from "../styles/card.module.css";
import { base_url } from "../../config";
import { cardNames } from "../utils/cardList";

function getRarity(name) {
  if (name.includes("epic")) return "epic";
  if (name.includes("uncommon")) return "uncommon";
  return "common";
}

function Card({ name }) {
  const cardRef = useRef(null);
  const rarity = getRarity(name);

  // Lag unik id basert på kortnavnet
  const cardId = `card-${name
    .replace(".png", "")
    .replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    let rotateX = ((y - centerY) / centerY) * 35;
    let rotateY = ((x - centerX) / centerX) * 35;

    rotateX = Math.max(-15, Math.min(35, rotateX));
    rotateY = Math.max(-15, Math.min(35, rotateY));

    card.style.transform = `perspective(600px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.25)`;
  };

  const handleMouseLeave = () => {
    cardRef.current.style.transform = "";
  };

  return (
    <div
      id={cardId}
      className={`${styles.cardItem} ${styles[rarity]}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={`${base_url}/${name}`}
        alt={name.replace(".png", "")}
        width={150}
        height={225}
        style={{ borderRadius: "10px", width: 150, height: 225 }}
      />
    </div>
  );
}

function Cards() {
  return (
    <div className={styles.cardsContainer}>
      {cardNames.map((name) => (
        <Card name={name} key={name} />
      ))}
    </div>
  );
}

export default Cards;
