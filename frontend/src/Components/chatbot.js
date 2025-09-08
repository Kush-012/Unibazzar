import React, { useState, useEffect, useRef } from "react";

// Function to convert simple Markdown (e.g., **bold**) to HTML
const renderMarkdown = (text) => {
  if (!text) return { __html: '' };
  // Replace bold markdown with <strong> tags
  const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return { __html: html };
};

export default function App() {
  // State for tracking if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: `Hi! I'm Unno, your assistant for Unibazzar. How can I help you?` },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  // State for toggling the chat window open/closed
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle sending a message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage = { sender: "user", text: input.trim() };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Determine visible pages based on login status
      const availablePages = isLoggedIn
        ? "home, signup, login, report, find, and chat"
        : "home, signup, and login";

      // Dynamically create the prompt with website context
      const prompt = `You are a helpful and friendly chatbot for the Unibazzar Hyperlocal Marketplace website. Your name is Unno. The user is currently ${isLoggedIn ? 'logged in' : 'not logged in'}. The website has pages for ${availablePages}. The user says: "${newUserMessage.text}". Provide helpful assistance, specifically for a college student, based on their context and the pages available to them.`;

      const res = await fetch("http://localhost:4500/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json();
      
      const botReply = data.response || "⚠️ I'm sorry, I couldn't get a response from the server.";

      setMessages(prevMessages => [...prevMessages, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("❌ Frontend error:", err);
      setMessages(prevMessages => [...prevMessages, { sender: "bot", text: "⚠️ Error connecting to the backend. Please check your server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // Main wrapper for the floating chatbox
    <div className="fixed z-50 bottom-6 right-6">
      
      {/* Floating button to open the chatbot with the AI symbol */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 text-white transition-transform transform bg-gray-900 rounded-full shadow-lg hover:bg-gray-700 hover:scale-110 focus:outline-none"
        >
          {/* AI icon in round with black and blue mix color */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: "#3B82F6", stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: "#1D4ED8", stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </button>
      )}

      {/* The Chatbot window */}
      {isOpen && (
        <div className="bg-gray-800 rounded-2xl shadow-2xl flex flex-col w-80 h-[400px]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 text-white bg-gray-700 rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              <h1 className="font-bold">Unno - Unibazzar Assistant</h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 transition-colors hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-white ${
                    msg.sender === "user"
                      ? "bg-blue-600 rounded-br-none"
                      : "bg-gray-700 rounded-bl-none"
                  }`}
                  // Use dangerouslySetInnerHTML to render the bolded text
                  dangerouslySetInnerHTML={renderMarkdown(msg.text)}
                ></div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 text-white bg-gray-700 rounded-bl-none rounded-2xl animate-pulse">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center p-4 border-t border-gray-700">
            <input
              type="text"
              className="flex-grow px-4 py-2 text-white transition-all duration-300 bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className={`ml-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-lg ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Send
            </button>
          </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4a5568 #2d3748;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4a5568;
          border-radius: 20px;
          border: 2px solid #2d3748;
        }
      `}</style>
    </div>
  );
};
