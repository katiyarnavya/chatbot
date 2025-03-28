import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import ChatbotIcon from "./Components/ChatbotIcon";
import MessageInput from "./Components/MessageInput";
import Message from "./Components/Message";
import { IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import { Brightness4, Brightness7, Download, Help } from "@mui/icons-material";
import {
  addMessage,
  updateMessageStatus,
  setTypingStatus,
  updateSettings,
  setError,
  clearError,
} from "./store/chatSlice";
import { sendMessage, sendVoiceMessage } from "./services/api";

function App() {
  const dispatch = useDispatch();
  const { messages, isTyping, messageStatuses, settings, error } = useSelector((state) => state.chat);
  const [darkMode, setDarkMode] = useState(settings.theme === 'dark');
  const chatBodyRef = useRef(null);
  const hasInitialized = useRef(false);

  // Initialize welcome message if no messages exist
  useEffect(() => {
    if (!hasInitialized.current && messages.length === 0) {
      hasInitialized.current = true;
      dispatch(addMessage({
        id: Date.now().toString(),
        type: 'text',
        text: "Hey there👋 How can I help you today?",
        owner: "bot",
        timestamp: Date.now(),
      }));
    }
  }, [messages.length, dispatch]);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const scrollTimer = requestAnimationFrame(scrollToBottom);
    return () => cancelAnimationFrame(scrollTimer);
  }, [messages]);

  const handleSendMessage = async (message, type) => {
    try {
      const messageId = Date.now().toString();
      let newMessage;

      if (type === 'voice') {
        const audioUrl = URL.createObjectURL(message);
        newMessage = {
          id: messageId,
          type: 'voice',
          audioUrl,
          owner: "user",
          timestamp: Date.now(),
        };
      } else {
        newMessage = {
          id: messageId,
          type: 'text',
          text: message,
          owner: "user",
          timestamp: Date.now(),
        };
      }

      dispatch(addMessage(newMessage));
      dispatch(updateMessageStatus({ messageId, status: 'sent' }));

      // Simulate message delivery and read status
      setTimeout(() => dispatch(updateMessageStatus({ messageId, status: 'delivered' })), 1000);
      setTimeout(() => dispatch(updateMessageStatus({ messageId, status: 'read' })), 2000);

      // Show bot typing indicator
      dispatch(setTypingStatus(true));

      // Send message to API
      let botResponse;
      if (type === 'voice') {
        botResponse = await sendVoiceMessage(message, settings);
      } else {
        botResponse = await sendMessage(message, settings);
      }

      // Add bot response
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: botResponse.type || 'text',
        text: botResponse.text,
        audioUrl: botResponse.audioUrl,
        owner: "bot",
        timestamp: Date.now(),
      };

      dispatch(addMessage(botMessage));
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch(setError(error.message || 'Failed to send message. Please try again.'));
    } finally {
      dispatch(setTypingStatus(false));
    }
  };

  const handleThemeToggle = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    dispatch(updateSettings({ theme: newTheme }));
  };

  const handleDownloadHistory = () => {
    try {
      const history = JSON.stringify(messages, null, 2);
      const blob = new Blob([history], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-history-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading chat history:', error);
      dispatch(setError('Failed to download chat history. Please try again.'));
    }
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  return (
    <div className="container">
      <div className={`chatbot-popup ${darkMode ? "dark-mode" : ""}`}>
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-txt">Aurobot</h2>
          </div>
          
          <div className="toggle-container">
            <Tooltip title="Download Chat History">
              <IconButton onClick={handleDownloadHistory}>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Help">
              <IconButton>
                <Help />
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle Theme">
              <IconButton onClick={handleThemeToggle}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <div className="chatbody" ref={chatBodyRef}>
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} isUser={msg.owner === "user"} />
          ))}
        </div>

        <div className="bot-footer">
          <MessageInput onSend={handleSendMessage} />
        </div>
      </div>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
