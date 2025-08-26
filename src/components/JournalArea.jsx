import React, { useEffect, useState, Suspense } from 'react'
import './JournalArea.css'
import Prompt from './Prompt'
import BackendService from '../services/backendService'
import UserService from '../services/userService'
import StoryHeading from './StoryHeading'

const JournalArea = () => {
    const [backendService] = useState(() => new BackendService());
    const [userService] = useState(() => new UserService());
    const [isConnected, setIsConnected] = useState(false);
    const [testSentence, setTestSentence] = useState([
        { word: "Loading...", type: "text"}
    ]);
    const [isLoading, setIsLoading] = useState(true);
    const [showWords, setShowWords] = useState(false);
    
    useEffect(() => {
        const initializeBackend = async () => {
            try {
                // Test backend connection
                const connected = await backendService.testConnection();
                setIsConnected(connected);
                
                if (connected) {
                    // Get user data and determine message type
                    const userData = userService.getUserData();
                    const messageType = userService.getMessageType();
                    console.log('Message type:', messageType);
                    
                    // Get appropriate message from backend
                    backendService.getMessage({ 
                        type: messageType,
                        userData 
                    }).then((response) => {
                        console.log('Response:', response);
                        setTestSentence(response);
                    });
                    
                    // Update session count
                    userService.updateSessionCount();
                }
            } catch (error) {
                console.error('Error initializing backend:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeBackend();
    }, [backendService]);

    const handleWordClick = (word) => {
        console.log('Word clicked:', word);
        backendService.sendInteraction(word.word, 'click');
    };

    const startStreaming = async () => {
        try {
            // Clear existing words
            if (window.promptController) {
                window.promptController.clearWords();
                window.promptController.setIsListening(true);
            }

            // Stream words from backend
            for await (const wordData of backendService.streamWords()) {
                if (window.promptController) {
                    window.promptController.addWord(wordData.word, wordData.type);
                }
                // Wait for the specified delay
                await new Promise(resolve => setTimeout(resolve, wordData.delay * 1000));
            }

            // Stop listening cursor
            if (window.promptController) {
                window.promptController.setIsListening(false);
            }
        } catch (error) {
            console.error('Error streaming words:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="journal-area">
                <h2 className="story-date">Story on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                <Suspense fallback={<div>Loading...</div>}>
                    <StoryHeading text="Genesis" />
                </Suspense>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="journal-area">
            <h2 className="story-date">Story on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
            <Suspense fallback={<div>Loading...</div>}>
                <StoryHeading 
                    text="Genesis" 
                    onAnimationComplete={() => setShowWords(true)}
                />
            </Suspense>
            {showWords && (
                <Prompt 
                    prompt={testSentence}
                    onWordClick={handleWordClick}
                />
            )}
        </div>
    )
}

export default JournalArea