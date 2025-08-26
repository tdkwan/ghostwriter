import React, { useState, useEffect } from 'react'

interface WordProps {
  word: string;
  type: string;
  handler?: () => void;
  style?: React.CSSProperties;
}

const Word: React.FC<WordProps> = ({ word, type, handler, style }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (type === 'highlight') {
      // Animate after the word's fade-in animation completes
      const animationDelay = style?.animationDelay || '0s';
      const delayMs = parseFloat(animationDelay) * 1000 + 200; // Add 500ms after fade-in
      
      const timer = setTimeout(() => {
        setIsAnimated(true);
      }, delayMs);

      return () => clearTimeout(timer);
    }
  }, [type, style?.animationDelay]);

  return (
    <span 
      className={`${type}-word ${isAnimated ? 'highlight-animated' : ''}`}
      onClick={handler} 
      style={{
        ...style,
        cursor: 'pointer'
      }}
    >
      {word}
    </span>
  )
}

export default Word;
