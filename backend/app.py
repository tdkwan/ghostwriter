from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json
import time
import random
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get onboarding phrase
@app.route('/onboarding', methods=['GET'])
def generate_onboarding_phrase():
    phrase = [
        { "word": "This", "type": "text" },
        { "word": "is", "type": "text" },
        { "word": "a", "type": "text" },
        { "word": "story", "type": "text" },
        { "word": "about", "type": "text" },
        { "word": "you", "type": "highlight" },
    ]
    return jsonify({"message": phrase})

# Sample word generation logic (replace with your AI model)
def generate_word(context=""):
    """Generate a word based on context"""
    # This is a placeholder - replace with your actual word generation logic
    sample_words = [
        {"word": "The", "type": "article"},
        {"word": "quick", "type": "adjective"},
        {"word": "brown", "type": "adjective"},
        {"word": "fox", "type": "noun"},
        {"word": "jumps", "type": "verb"},
        {"word": "over", "type": "preposition"},
        {"word": "the", "type": "article"},
        {"word": "lazy", "type": "adjective"},
        {"word": "dog", "type": "noun"},
        {"word": ".", "type": "punctuation"}
    ]
    
    # Simple context-aware selection (replace with your logic)
    if context:
        # Use context to influence word selection
        pass
    
    return random.choice(sample_words)

@app.route('/message', methods=['POST'])
def get_message():
    data = request.get_json()
    message_type = data.get('type')
    user_data = data.get('userData')

    print(data)
    print(message_type)
    print(user_data)
    
    # Return appropriate message based on type and user data
    if message_type == 'onboarding':
        print("Generating onboarding phrase")
        phrase = [
            { "word": "This", "type": "text" },
            { "word": "is", "type": "text" },
            { "word": "a", "type": "text" },
            { "word": "story", "type": "text" },
            { "word": "about", "type": "text" },
            { "word": "you", "type": "highlight" },
        ]
        return jsonify({"message": phrase})
    elif message_type == 'returning':
        phrase = [
            { "word": "Welcome", "type": "text" },
            { "word": "back", "type": "text" },
            { "word": "to", "type": "text" },
            { "word": "your", "type": "text" },
            { "word": "story", "type": "highlight" },
        ]
        return jsonify({"message": phrase})
    elif message_type == 'daily':
        phrase = [
            { "word": "Today's", "type": "text" },
            { "word": "adventure", "type": "text" },
            { "word": "begins", "type": "text" },
            { "word": "now", "type": "highlight" },
        ]
        return jsonify({"message": phrase})
    else:
        # Default fallback
        phrase = [
            { "word": "Hello", "type": "text" },
            { "word": "there", "type": "text" },
        ]
        return jsonify({"message": phrase})

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Backend is running"})

@app.route('/generate-word', methods=['POST'])
def get_next_word():
    """Generate a single word"""
    try:
        data = request.get_json()
        context = data.get('context', '')
        
        word_data = generate_word(context)
        word_data['delay'] = random.uniform(0.1, 0.5)  # Random delay
        
        return jsonify(word_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stream-words', methods=['POST'])
def stream_words():
    """Stream words one by one"""
    def generate():
        try:
            data = request.get_json()
            context = data.get('context', '')
            word_count = data.get('count', 10)  # Number of words to generate
            
            for i in range(word_count):
                word_data = generate_word(context)
                word_data['delay'] = random.uniform(0.1, 0.5)
                
                # Send word as JSON line
                yield f"data: {json.dumps(word_data)}\n\n"
                time.sleep(word_data['delay'])
                
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return Response(generate(), mimetype='text/plain')

@app.route('/interaction', methods=['POST'])
def handle_interaction():
    """Handle user interactions with words"""
    try:
        data = request.get_json()
        word = data.get('word')
        action = data.get('action')  # 'click', 'hover', etc.
        
        # Log interaction (replace with your logic)
        print(f"User {action}ed word: {word}")
        
        # You can use this to improve word generation
        # or trigger other backend actions
        
        return jsonify({"status": "received"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
