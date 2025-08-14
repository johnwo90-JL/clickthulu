import styles from "@styles/helperFunction/imageRenderer.module.css";

const ImagePlaceholder = ({ width="fitContent", height="fitContent", icon="📷", text="Image Placeholder" }) => {
    return (
        <div className={styles.imagePlaceholder} style={{ width, height }}>
            <span>{icon}</span>
            <p>{text}</p>
        </div>
    );
};

const ImageRenderer = ({ src, alt="Image", width="fitContent", height="fitContent", fallbackIcon="📷", fallbackText="Image Placeholder" }) => {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={styles.image}
                style={{ width, height, objectFit: "cover" }}
            />
        );
    }

    return (
        <ImagePlaceholder
            width={width}
            height={height}
            icon={fallbackIcon}
            text={fallbackText}
        />
    );
};

export default ImageRenderer;
