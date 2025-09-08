import React, { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const ws = useRef(null);

  // Get user ID and name from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const myId = user.id || "";
  const userName = user.name || "Unknown";

  // Fetch user data from backend (excluding self)
  const fetchData = async () => {
    if (!myId) return;
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4500/signup");
      const res = await response.json();
      const userList = res
        .filter((item) => item.id !== myId)
        .map((item) => ({ id: item.id, name: item.name }));
      setUsers(userList);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [myId]);

  // Set up WebSocket connection
  useEffect(() => {
    if (!myId) return;

    ws.current = new WebSocket("ws://localhost:4500");

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "auth", id: myId }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message" && selectedUser && data.from === selectedUser.id) {
        setMessages((prev) => [
          ...prev,
          { sender: data.from, receiver: myId, text: data.text, timestamp: new Date() },
        ]);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.current.close();
    };
  }, [myId, selectedUser]);

  // Fetch message history when selecting a user
  useEffect(() => {
    if (selectedUser && myId) {
      setIsLoading(true);
      fetch(
        `http://localhost:4500/messages?myId=${myId}&otherId=${selectedUser.id}`
      )
        .then((res) => res.json())
        .then((data) => {
          setMessages(
            data.map((msg) => ({
              sender: msg.sender,
              receiver: msg.receiver,
              text: msg.text,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
            }))
          );
        })
        .catch((err) => console.error("Failed to fetch messages:", err))
        .finally(() => setIsLoading(false));
    }
  }, [selectedUser, myId]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle selecting a user
  const handleSelect = (userObj) => {
    setSelectedUser(userObj);
  };

  // Handle sending message via WebSocket
  const sendMessage = () => {
    if (newMessage.trim() !== "" && selectedUser && ws.current) {
      const messageData = {
        type: "message",
        to: selectedUser.id,
        text: newMessage,
      };
      ws.current.send(JSON.stringify(messageData));

      // Optimistically add to local messages
      setMessages([
        ...messages,
        { sender: myId, receiver: selectedUser.id, text: newMessage, timestamp: new Date() },
      ]);
      setNewMessage("");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Format date for display (Today, Yesterday, or date)
  const formatDateLabel = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (isSameDay(today, messageDate)) {
      return "Today";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (isSameDay(yesterday, messageDate)) {
      return "Yesterday";
    }
    
    return messageDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const grouped = {};
    
    messages.forEach((message, index) => {
      const dateLabel = formatDateLabel(message.timestamp);
      
      if (!grouped[dateLabel]) {
        grouped[dateLabel] = [];
      }
      
      // Check if we need to add a date separator
      if (index === 0 || formatDateLabel(messages[index - 1].timestamp) !== dateLabel) {
        grouped[dateLabel].push({ type: 'date', value: dateLabel });
      }
      
      grouped[dateLabel].push({ type: 'message', value: message });
    });
    
    return grouped;
  };

  // Flatten grouped messages for rendering
  const getFlattenedMessages = () => {
    const grouped = groupMessagesByDate();
    return Object.values(grouped).flat();
  };

  if (!myId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md p-8 mx-4 text-center bg-white shadow-lg rounded-xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full">
            <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div> 
          <h3 className="mb-3 text-2xl font-bold text-gray-800">Authentication Required</h3>
          <p className="mb-6 text-gray-600">Please log in to access the chat feature</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 font-medium text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const flattenedMessages = getFlattenedMessages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex h-[80vh] max-w-6xl mx-auto">
        {/* User List Section - Always visible on larger screens */}
        <div className="flex flex-col w-full p-4 overflow-hidden md:w-1/3">
          <div className="flex flex-col h-full bg-white shadow-lg rounded-2xl">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">UniBazaar Chat</h1>
              <p className="text-gray-600">Connect with other students</p>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <h2 className="mb-4 font-semibold text-gray-700">Your Contacts</h2>
              
              {users.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  {isLoading ? "Loading contacts..." : "No contacts available"}
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map((userObj, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelect(userObj)}
                      className={`flex items-center p-3 cursor-pointer rounded-xl transition-all ${
                        selectedUser?.id === userObj.id 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12 mr-3 font-medium text-white bg-blue-500 rounded-full">
                        {userObj.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate">{userObj.name}</div>
                        <div className="text-sm text-gray-500 truncate">ID: {userObj.id}</div>
                      </div>
                      {selectedUser?.id === userObj.id && (
                        <div className="w-3 h-3 ml-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-3 text-green-600 bg-green-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">{userName}</div>
                  <div className="text-sm text-gray-500">Online</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 p-4 overflow-hidden">
          {selectedUser ? (
            <div className="flex flex-col h-full bg-white shadow-lg rounded-2xl">
              {/* Chat Header */}
              <div className="px-6 py-4 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 mr-4 text-lg font-bold text-white bg-blue-400 rounded-full">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">{selectedUser.name}</h2>
                    <p className="text-sm text-blue-100">Active now</p>
                  </div>
                  <button className="p-2 text-blue-200 transition-colors rounded-full hover:text-white hover:bg-blue-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Messages Container */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center text-gray-400">
                      <div className="w-8 h-8 mb-2 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                      <p>Loading messages...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <div className="p-4 mb-4 bg-white rounded-full shadow-sm">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-500">No messages yet</h3>
                    <p className="max-w-md text-gray-400">Send a message to start a conversation with {selectedUser.name}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {flattenedMessages.map((item, index) => {
                      if (item.type === 'date') {
                        return (
                          <div key={`date-${index}`} className="flex justify-center my-4">
                            <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-200 rounded-full">
                              {item.value}
                            </div>
                          </div>
                        );
                      }
                      
                      const msg = item.value;
                      return (
                        <div
                          key={index}
                          className={`flex ${msg.sender === myId ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === myId 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none" 
                            : "bg-white border border-gray-200 shadow-sm rounded-bl-none"}`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <div className={`flex items-center justify-end mt-1 text-xs ${msg.sender === myId ? "text-blue-100" : "text-gray-400"}`}>
                              {formatTime(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="flex items-center px-5 font-medium text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-100 disabled:cursor-not-allowed"
                  >
                    <span>Send</span>
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white shadow-lg rounded-2xl">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-blue-100 rounded-full">
                  <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-800">Welcome to UniBazaar Chat</h3>
                <p className="mb-6 text-gray-600">
                  Select a contact from the list to start chatting with other students on the platform.
                  You can buy, sell, and trade items with your university community.
                </p>
                <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                  <h4 className="mb-2 font-semibold text-blue-800">How it works:</h4>
                  <ul className="space-y-1 text-sm text-left text-blue-700">
                    <li className="flex items-start">
                      <span className="flex items-center justify-center inline-block w-5 h-5 mr-2 text-xs text-blue-700 bg-blue-100 rounded-full">1</span>
                      Select a contact from the left panel
                    </li>
                    <li className="flex items-start">
                      <span className="flex items-center justify-center inline-block w-5 h-5 mr-2 text-xs text-blue-700 bg-blue-100 rounded-full">2</span>
                      Start a conversation about items you want to buy or sell
                    </li>
                    <li className="flex items-start">
                      <span className="flex items-center justify-center inline-block w-5 h-5 mr-2 text-xs text-blue-700 bg-blue-100 rounded-full">3</span>
                      Arrange meetups safely on campus
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}