import React, { useState, useEffect } from 'react';

const StoryHeading = ({ text, onAnimationComplete }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Delay the fade-in effect
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isVisible) {
            // Call the callback after animation completes (500ms delay + 600ms animation)
            const animationTimer = setTimeout(() => {
                onAnimationComplete?.();
            }, 1100);

            return () => clearTimeout(animationTimer);
        }
    }, [isVisible, onAnimationComplete]);

    return (
        <h1 
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
                transition: 'opacity .3s cubic-bezier(.62,.01,.28,1), transform .6s cubic-bezier(.01,.83,.09,.99)',
                fontFamily: 'Circular Std',
                fontSize: '2.5em',
                lineHeight: '1.1',
                margin: '0 0 1rem 0'
            }}
        >
            {text}
        </h1>
    );
};

export default StoryHeading;
