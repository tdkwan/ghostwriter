import React, { useState, useEffect } from 'react'
import Word from './Word.tsx'

interface WordItem {
    word: string;
    type: string;
    id: string;
}

interface PromptProps {
    prompt?: Array<{ word: string; type: string }>;
    onWordClick?: (word: WordItem) => void;
}

const Prompt: React.FC<PromptProps> = ({ prompt = [{word: "Loading...", type: "text"}], onWordClick }) => {
    const [words, setWords] = useState<WordItem[]>([]);
    const [isListening, setIsListening] = useState(false);

    // Initialize with initial sentence if provided
    useEffect(() => {
        if (prompt && prompt.length > 0) {
            const initialWords = prompt.map((item, index) => ({
                ...item,
                id: `initial-${index}`
            }));
            setWords(initialWords);
        }
    }, [prompt]);

    // Function to add a new word (called from parent or backend)
    const addWord = (word: string, type: string = 'normal') => {
        const newWord: WordItem = {
            word,
            type,
            id: `word-${Date.now()}-${Math.random()}`
        };
        setWords(prev => [...prev, newWord]);
    };

    // Function to clear all words
    const clearWords = () => {
        setWords([]);
    };

    // Expose functions to parent component
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).promptController = {
                addWord,
                clearWords,
                setIsListening
            };
        }
    }, []);

    const handleWordClick = (word: WordItem) => {
        console.log('Word clicked:', word);
        onWordClick?.(word);
    };

    return (
        <div className="prompt">
            {words.map((item, index) => (
                <Word 
                    key={item.id} 
                    word={item.word} 
                    type={item.type} 
                    handler={item.type === 'highlight' ? () => handleWordClick(item) : undefined}
                    style={{
                        animationDelay: `${index * 0.3}s`,
                        opacity: 0,
                        animation: `fadeIn 0s ease-in-out ${index * 0.2}s forwards`
                    }}
                />
            ))}
            {isListening && (
                <span className="cursor" style={{ animation: 'blink 1s infinite' }}>
                    |
                </span>
            )}
        </div>
    )
}

export default Prompt
