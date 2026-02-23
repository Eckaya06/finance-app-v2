import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

// Hiç silinmeyecek sabit karşılama mesajı
const WELCOME_MESSAGE = { 
  sender: 'bot', 
  text: 'Hello! How can I help you manage your finances today?' 
};

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [unreadCount, setUnreadCount] = useState(1);

  const toggleChat = () => {
    setIsOpen((prev) => {
      const isClosing = prev === true;

      if (isClosing) {
        // ✅ PENCERE KAPANDIĞINDA: Hafızayı temizle (Sadece ilk mesaj kalsın)
        setMessages([WELCOME_MESSAGE]);
      } else {
        // ✅ PENCERE AÇILDIĞINDA: Bildirim sayısını sıfırla
        setUnreadCount(0);
      }
      
      return !prev;
    });
  };

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
    
    // Mesaj bot'tan geliyorsa ve pencere kapalıysa kırmızı noktayı (badge) tetikle
    if (sender === 'bot' && !isOpen) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat, messages, addMessage, unreadCount }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};