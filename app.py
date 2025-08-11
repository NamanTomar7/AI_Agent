from flask import Flask, request, jsonify
from transformers import pipeline
from gtts import gTTS
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Load Chatbot model (you can switch to a more powerful one later)
chatbot = pipeline("text-generation", model="gpt2")

# Text-to-Speech engine

def generate_response(text):
    result = chatbot(text, max_new_tokens=50, num_return_sequences=1)
    return result[0]['generated_text']

def generate_voice(text, filename="voice.mp3"):
    tts = gTTS(text)
    tts.save(filename)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    # Generate chatbot reply
    response = generate_response(user_message)

    # Generate speech output
    generate_voice(response)

    return jsonify({
        "reply": response,
        "voice_path": "/voice.mp3"  # frontend can fetch this file
    })

@app.route('/voice.mp3')
def get_voice():
    return app.send_static_file("voice.mp3")

if __name__ == '__main__':
    # Ensure voice file is served
    app.static_folder = '.'
    app.run(debug=True)
