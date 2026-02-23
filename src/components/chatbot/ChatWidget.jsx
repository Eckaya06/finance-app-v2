// src/components/chatbot/ChatWidget.jsx
import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useTransactions } from '../../context/TransactionContext';
import { getAiResponse } from '../../services/aiService';
import './ChatWidget.css';

const ChatWidget = () => {
  const { toggleChat, messages, addMessage } = useChat();
  const { transactions } = useTransactions();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    
    // 1. Kullanıcı mesajını ekrana bas
    addMessage('user', userMsg);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Yapay zekadan yanıtı al
      const aiResponse = await getAiResponse(userMsg, transactions);
      
      // 3. Bot yanıtını ekrana bas
      addMessage('bot', aiResponse);
    } catch (err) {
      addMessage('bot', "Bir sorun oluştu Muhammed Enes, lütfen tekrar dener misin?");
    } finally {
      setIsLoading(false);
    }
  };

  // Dışarı tıklayınca kapatma mantığı
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        toggleChat();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [toggleChat]);

  return (
    <div className="chat-widget-container">
      <div className="chat-window" ref={chatRef}>
        <div className="chat-header">
          <h4>🤖 Finance AI Assistant</h4>
          <button type="button" onClick={toggleChat} className="close-btn">✖</button>
        </div>
        
        <div className="chat-body">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message bot">
              <span className="loading-text">Analiz ediyorum Muhammed Enes... 🧠</span>
            </div>
          )}
        </div>

        <form className="chat-footer" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "Yapay zeka yanıtlıyor..." : "Harcamalarını sor..."}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "..." : "Sor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;