import React, { useState } from "react";
import styles from "../styles/gambling.module.css";
import { base_url } from "../../config";

function Gambling() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    // Her kan du legge til animasjon eller loot-funksjon!
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
    </div>
  );
}

export default Gambling;
