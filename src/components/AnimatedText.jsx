import { useEffect, useState, useRef } from "react"

function useInterval(callback, delay) {
  const savedCallback = useRef();
 
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
 
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const AnimatedText = ({ text, delay = 1000 }) => {
  const words = text.split(" ");
  const [visibleWords, setVisibleWords] = useState([]);
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
  }, isRunning ? delay : null); // Added words.length to dependencies

  console.log(visibleWords);
  return <p>{visibleWords.join(" ")}</p>;
};

export default AnimatedText;
// Create a function that takes an array of components and renders each word
// according to its type and pauses animation according to the word length
// does each word need to be a component?
// some words need to be:
  // clickable for expansion
  // underlined
  // highlighted