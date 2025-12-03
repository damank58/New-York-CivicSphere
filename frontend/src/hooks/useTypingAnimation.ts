import { useEffect, useState } from "react";

type UseTypingAnimationOptions = {
  text: string | null;
  speed?: number; // milliseconds per character
  enabled?: boolean; // whether to start the animation
};

/**
 * Custom hook that provides a typing animation effect.
 * Progressively reveals text character by character.
 */
export const useTypingAnimation = ({ 
  text, 
  speed = 30,
  enabled = true 
}: UseTypingAnimationOptions): string => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text || !enabled) {
      setDisplayedText("");
      return;
    }

    setDisplayedText("");
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, speed);

    return () => {
      clearInterval(typeInterval);
    };
  }, [text, speed, enabled]);

  return displayedText;
};

