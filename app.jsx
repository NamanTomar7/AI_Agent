import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      const botMessage = { sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, userMessage, botMessage]);

      // Play voice response
      const audio = new Audio('http://localhost:5000' + data.voice_path);
      audio.play();

    } catch (error) {
      console.error("Error:", error);
    }

    setInput('');
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={styles.container}>
      <h2>🤖 AI Voice Chatbot</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#dcf8c6' : '#f1f0f0'
            }}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && <div style={styles.loading}>Typing...</div>}
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center'
  },
  chatBox: {
    border: '1px solid #ccc',
    height: '400px',
    padding: '10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    marginBottom: 10
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '80%',
    marginBottom: '10px'
  },
  inputArea: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px'
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px'
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px'
  },
  loading: {
    fontStyle: 'italic',
    color: '#999'
  }
};

export default App;
