import React from "react";
import styles from "../styles/tempupgrades.module.css";

const upgrades = [
  { name: "VFT", description: "Upgrade VFT", img: "Vft.png" },
  { name: "UGF", description: "Upgrade UGF", img: "Ugf.png" },
  { name: "TGF", description: "Upgrade TGF", img: "Tgf.png" },
  { name: "FST", description: "Upgrade FST", img: "Fst.png" },
  { name: "DST", description: "Upgrade DST", img: "Dst.png" },
  { name: "DGF", description: "Upgrade DGF", img: "Dgf.png" },
  { name: "DFE", description: "Upgrade DFE", img: "Dfe.png" },
  { name: "CLS", description: "Upgrade CLS", img: "Cls.png" },
];

function TempUpgrades() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Temp Upgrades</h2>
      <ul className={styles.upgradeList}>
        {upgrades.map((upg, idx) => (
          <li key={idx} className={styles.upgradeItem}>
            <img
              src={`/${upg.img}`}
              alt={upg.name}
              className={styles.upgradeImg}
              width={64}
              height={64}
              style={{ marginBottom: "12px" }}
            />
            <h3 className={styles.upgradeName}>{upg.name}</h3>
            <p className={styles.upgradeDesc}>{upg.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TempUpgrades;
