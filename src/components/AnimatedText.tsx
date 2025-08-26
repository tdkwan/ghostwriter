import React, { useState, useRef } from "react";
import { useInterval } from "./useInterval";

interface AnimatedTextProps {
  text: string;
  delay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, delay = 1000 }) => {
  const words = text.split(" ");
  const [visibleWords, setVisibleWords] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const index = useRef(0);

  useInterval(() => {
    console.log(words[index.current]);
    setVisibleWords((prev) => [...prev, words[index.current]]);
    console.log(visibleWords);
    let next = index.current + 1;
    index.current = next;
    if (index.current >= words.length) {
      setIsRunning(false);
    }
  }, isRunning ? delay : null);

  console.log(visibleWords);
  return <p>{visibleWords.join(" ")}</p>;
};

export default AnimatedText;
