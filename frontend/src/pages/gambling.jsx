import React, { useState } from "react";
import "../styles/gambling.module.css";

function Gambling() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    // Her kan du legge til animasjon eller loot-funksjon!
  };

  return (
    <div className="crate-container">
      <h2>Åpne en kiste!</h2>
      <div className="crate-animation">
        <img
          src={isOpen ? "/Chest_open.png" : "/Chest_closed.png"}
          alt={isOpen ? "Åpen kiste" : "Lukket kiste"}
          className={`crate-img ${isOpen ? "open" : "closed"}`}
          width={180}
          height={180}
        />
      </div>
      {!isOpen && (
        <button className="crate-open-btn" onClick={handleOpen}>
          Åpne kiste
        </button>
      )}
    </div>
  );
}

export default Gambling;
