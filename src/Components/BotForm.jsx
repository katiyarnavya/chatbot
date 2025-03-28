import React, { useRef } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const BotForm = ({ addNewMessage }) => {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputRef.current.value;
    if (text.trim() == '') {
      console.log("mabvya gadhi")
    }
    else {
      addNewMessage(text);
    }
    console.log("Message Submitted:", text);
    inputRef.current.value = ""; // Clear input after submission
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          ref={inputRef}
          type="text"
          placeholder="Message"
          className="msg-input"
          required
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        />
        <KeyboardArrowUpIcon
          style={{ fontSize: 40, color: "blue", cursor: "pointer", marginRight: 10 }}
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
};

export default BotForm;
