import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Tabs, Tab } from '@mui/material';
import { Send, EmojiEmotions, FormatBold, FormatItalic, FormatListBulleted, Mic, Settings } from '@mui/icons-material';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useSelector } from 'react-redux';
import VoiceMessage from './VoiceMessage';
import BotSettings from './BotSettings';

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showBotSettings, setShowBotSettings] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const textFieldRef = useRef(null);
  const { settings } = useSelector((state) => state.chat);
  const { characterLimit, mentions } = settings;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend(message, 'text');
      setMessage('');
    }
  };

  const handleVoiceMessage = (blob) => {
    onSend(blob, 'voice');
  };

  const onEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const applyFormatting = (type) => {
    const textarea = textFieldRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.substring(start, end);
    let newText = message;

    switch (type) {
      case 'bold':
        newText = message.substring(0, start) + `**${selectedText}**` + message.substring(end);
        break;
      case 'italic':
        newText = message.substring(0, start) + `*${selectedText}*` + message.substring(end);
        break;
      case 'list':
        newText = message.substring(0, start) + `\n- ${selectedText}` + message.substring(end);
        break;
      default:
        break;
    }

    setMessage(newText);
    setShowFormatting(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ position: 'relative', p: 2 }}>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Text" />
        <Tab label="Voice" />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <EmojiEmotions />
            </IconButton>
            <IconButton onClick={() => setShowFormatting(!showFormatting)}>
              <FormatBold />
            </IconButton>
            <IconButton onClick={() => setShowBotSettings(true)}>
              <Settings />
            </IconButton>
          </Box>

          {showEmojiPicker && (
            <Paper sx={{ position: 'absolute', bottom: 0, right: 0, zIndex: 1000 }}>
              <Picker data={data} onEmojiSelect={onEmojiSelect} />
            </Paper>
          )}

          {showFormatting && (
            <Paper sx={{ position: 'absolute', bottom: 0, right: 0, zIndex: 1000, p: 1 }}>
              <IconButton onClick={() => applyFormatting('bold')}>
                <FormatBold />
              </IconButton>
              <IconButton onClick={() => applyFormatting('italic')}>
                <FormatItalic />
              </IconButton>
              <IconButton onClick={() => applyFormatting('list')}>
                <FormatListBulleted />
              </IconButton>
            </Paper>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message... Use @ to mention users"
              inputRef={textFieldRef}
              helperText={`${message.length}/${characterLimit}`}
              error={message.length > characterLimit}
            />
            <IconButton onClick={handleSend} color="primary" disabled={!message.trim()}>
              <Send />
            </IconButton>
          </Box>
        </>
      ) : (
        <VoiceMessage onSend={handleVoiceMessage} />
      )}

      <BotSettings open={showBotSettings} onClose={() => setShowBotSettings(false)} />
    </Box>
  );
};

export default MessageInput; 