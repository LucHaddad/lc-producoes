
import { useEffect, useState } from "react";

interface ScrollFade {
    opacity: number;
    filter: string;
}

export function useScrollFade(): ScrollFade {
    const [fade, setFade] = useState<ScrollFade>({
        opacity: 1,
        filter: "blur(0px)",
    });

    useEffect(() => {
        let frameId = 0;

        const updateFade = () => {
            cancelAnimationFrame(frameId);

            frameId = requestAnimationFrame(() => {
                const threshold = window.innerHeight * 0.85;
                const progress = Math.min(
                    Math.max(window.scrollY / threshold, 0),
                    1,
                );

                setFade({
                    opacity: 1 - progress,
                    filter: `blur(${progress * 10}px)`,
                });
            });
        };

        updateFade();
        window.addEventListener("scroll", updateFade, { passive: true });
        window.addEventListener("resize", updateFade);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("scroll", updateFade);
            window.removeEventListener("resize", updateFade);
        };
    }, []);

    return fade;
}
