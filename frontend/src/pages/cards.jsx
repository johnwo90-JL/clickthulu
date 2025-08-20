import React, { useRef } from "react";
import styles from "../styles/card.module.css";
import { base_url } from "../../config";

const cardNamesRaw = [
  "Demon_common.png",
  "Xpboost_common.png",
  "Doctor_common.png",
  "Demon_uncommon.png",
  "Xpboost_uncommon.png",
  "Doctor_uncommon.png",
  "Demon_epic.png",
  "Xpboost_epic.png",
  "Doctor_epic.png",
  "Castle_common.png",
  "Castle_uncommon.png",
  "Castle_epic.png",
  "Finger_common.png",
  "Finger_uncommon.png",
  "Finger_epic.png",
  "Wingydemon_common.png",
  "Wingydemon_uncommon.png",
  "Wingydemon_epic.png",
  "Nokken_common.png",
  "Nokken_uncommon.png",
  "Nokken_epic.png",
  "Oldman_common.png",
  "Oldman_uncommon.png",
  "Oldman_epic.png",
];

function getRarity(name) {
  if (name.includes("epic")) return "epic";
  if (name.includes("uncommon")) return "uncommon";
  return "common";
}

const rarityOrder = { common: 0, uncommon: 1, epic: 2 };
const cardNames = [...cardNamesRaw].sort(
  (a, b) => rarityOrder[getRarity(a)] - rarityOrder[getRarity(b)]
);

function Card({ name }) {
  const cardRef = useRef(null);

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

  const rarity = getRarity(name);

  return (
    <div
      className={`${styles.card} ${styles[rarity]}`}
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
