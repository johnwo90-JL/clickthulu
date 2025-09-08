import React, { useRef, useState } from "react";
import styles from "../styles/tempupgrades.module.css";
import { base_url } from "../../config";

function TempUpgrade({ img, name, effectClass, description }) {
  const canvasRef = useRef(null);
  const [animating, setAnimating] = useState(false);

  const startAnimation = () => {
    setAnimating(true);
    let start = null;
    const duration = 1200; // ms

    function animate(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const degrees = 360 * progress;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const size = canvas.width;

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, 0, (degrees * Math.PI) / 180);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,140,0,0.3)";
      ctx.fill();
      ctx.restore();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimating(false);
        ctx.clearRect(0, 0, size, size);
      }
    }

    requestAnimationFrame(animate);
  };

  return (
    <li className={styles.upgradeItem} style={{ position: "relative" }}>
      <div
        style={{
          position: "relative",
          width: 128,
          height: 128,
          margin: "0 auto",
        }}
      >
        <img
          src={`${base_url}/${img}`}
          alt={name}
          className={`${styles.upgradeImg} ${effectClass || ""}`}
          width={128}
          height={128}
          onClick={startAnimation}
          style={{ cursor: "pointer" }}
        />
        <canvas
          ref={canvasRef}
          width={128}
          height={128}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: "none",
          }}
        />
      </div>
      <h3 className={styles.upgradeName}>{name}</h3>
      <p className={styles.upgradeDesc}>{description}</p>
    </li>
  );
}

const upgrades = [
  {
    name: "Fireknifev2",
    description: "Fireknife",
    img: "Fireknifev2.png",
    effectClass: styles.fireknife,
  },
  {
    name: "UGF",
    description: "Upgrade UGF",
    img: "Ugf.png",
    effectClass: styles.ugf,
  },
  {
    name: "TGF",
    description: "Upgrade TGF",
    img: "Tgf.png",
    effectClass: styles.tgf,
  },
  {
    name: "FST",
    description: "Upgrade FST",
    img: "Fst.png",
    effectClass: styles.fst,
  },
  {
    name: "DST",
    description: "Upgrade DST",
    img: "Dst.png",
    effectClass: styles.dst,
  },
  {
    name: "DGF",
    description: "Upgrade DGF",
    img: "Dgf.png",
    effectClass: styles.dgf,
  },
  {
    name: "DFE",
    description: "Upgrade DFE",
    img: "Dfe.png",
    effectClass: styles.dfe,
  },
  {
    name: "CLS",
    description: "Upgrade CLS",
    img: "Cls.png",
    effectClass: styles.cls,
  },
  {
    name: "Rne",
    description: "Rune Upgrade",
    img: "Rne.png",
    effectClass: styles.rne,
  },
];

function TempUpgrades() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Temp Upgrades</h2>
      <ul className={styles.upgradeList}>
        {upgrades.map((upg, idx) => (
          <TempUpgrade key={idx} {...upg} />
        ))}
      </ul>
    </div>
  );
}

export default TempUpgrades;
