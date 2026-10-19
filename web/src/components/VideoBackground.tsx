
import { useScrollFade } from "../hooks/useScrollFade";

export default function VideoBackground() {
    const fade = useScrollFade();

    return (
        <div
            className="video-background"
            style={{
                opacity: fade.opacity,
                filter: fade.filter,
            }}
            aria-hidden="true"
        >
            <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/media/poster-desktop.jpg"
            >
                <source
                    src="/media/hero-mobile.mp4"
                    type="video/mp4"
                    media="(max-width: 640px)"
                />
                <source
                    src="/media/hero-desktop.mp4"
                    type="video/mp4"
                />
            </video>

            <div className="video-overlay" />
        </div>
    );
}
