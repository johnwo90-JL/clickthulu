import useClickCounter from "@hooks/clickCounter.jsx";
import ImageRenderer from "@assets/assetFunctions/imageRenderer.jsx";

import styles from "@styles/gameUI/button.module.css";

export const Clicker = ({ label, src, alt, className, onClick, ...props }) => {
    const { count, increment } = useClickCounter();
    const incrementClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        increment();
    }
    const texts = {
        label: label || "Click Me!",
    }

    const clickerClass = className ? `${styles.clickerContainer} ${className}` : styles.clickerContainer;

    return (
        <div className={clickerClass}>
            <div className={styles.headText}>
                <h2>
                    {count}
                </h2>
            </div>
            <button className={styles.clickButton} onClick={incrementClick} onMouseDown={(e) => e.preventDefault()} {...props}>
                <p>
                    {texts.label}
                </p>
            </button>
        </div>
    );
}

export const Buttons = ({ label, src, alt, className, onClick, ...props }) => {
    const texts = {
        label: label || "Button",
    }
    const buttonClass = className ? `${styles.button} ${className}` : styles.button;

    return (
        <button className={buttonClass} onClick={onClick} {...props}>
            {src && <ImageRenderer src={src} alt={alt || label} width="24px" height="24px" fallbackIcon="📷" fallbackText={label} />}
            {texts.label}
        </button>
    )
}