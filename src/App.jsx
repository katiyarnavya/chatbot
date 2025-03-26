import { useState, useEffect, useRef, useMemo} from "react";
import "./App.css";
import axios from "axios";
import ChatbotIcon from "./Components/ChatbotIcon";
import BotForm from "./Components/BotForm";
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

function App() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hey there👋 How can I help you today?",
      owner: "bot",
      timestamp: Date.now(),
    },
    {
      id: "2",
      text: "Hey! Please tell me .....",
      owner: "user",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);


  const addNewMessage = (message) => {
    const newMessage = {
      id: `${(messages.length + 1)}`,
      text: message,
      owner: "user",
      timestamp: Date.now(),
    };
    // handleSendMessage(message);
    console.log("mess", messages);
    setMessages([...messages, newMessage]);
  }


  const chatBodyRef = useRef(null);
  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Use requestAnimationFrame for smoother scrolling
    const scrollTimer = requestAnimationFrame(() => {
      scrollToBottom();
    });

    // Cleanup to prevent memory leaks
    return () => cancelAnimationFrame(scrollTimer);
  }, [messages]);

  return (
    <>
      <div className="container">
      <div className={`chatbot-popup ${darkMode ? "dark-mode" : "light-mode"}`}>
          <div className="chat-header">
            <div className="header-info">
              <ChatbotIcon />
              <h2 className="logo-txt">Aurobot</h2>
              {/* <button className="material-symbols-rounded">keyboard_arrow_down</button> */}
            </div>
            
            <div className="toggle-container">
            <IconButton onClick={() => setDarkMode(!darkMode)} className="toggle-button">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* <button className="material-symbols-rounded">keyboard_arrow_down</button> */}
          </div>
            
          </div>

          <div className="chatbody" ref={chatBodyRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`msg ${msg.owner}-msg`}>
                {msg.owner === "bot" && <ChatbotIcon />}
                <p className="msg-text">{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="bot-footer">
            <BotForm addNewMessage={addNewMessage} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
