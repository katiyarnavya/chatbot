import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  userStatus: 'active',
  isTyping: false,
  messageStatuses: {},
  settings: {
    theme: 'light',
    characterLimit: 500,
    showTypingIndicator: true,
    showReadReceipts: true,
    botPersonality: {
      name: 'Aurobot',
      style: 'friendly',
      tone: 'professional',
      responseLength: 'medium',
    },
    voiceSettings: {
      enabled: true,
      autoPlay: false,
      playbackSpeed: 1.0,
    },
    mentions: {
      enabled: true,
      highlightColor: '#007AFF',
    },
  },
  error: null,
  offlineMode: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      state.error = null;
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      if (messageId) {
        state.messageStatuses[messageId] = status;
      }
    },
    setUserStatus: (state, action) => {
      state.userStatus = action.payload;
    },
    setTypingStatus: (state, action) => {
      state.isTyping = action.payload;
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    updateBotPersonality: (state, action) => {
      state.settings.botPersonality = {
        ...state.settings.botPersonality,
        ...action.payload,
      };
    },
    updateVoiceSettings: (state, action) => {
      state.settings.voiceSettings = {
        ...state.settings.voiceSettings,
        ...action.payload,
      };
    },
    updateMentionSettings: (state, action) => {
      state.settings.mentions = {
        ...state.settings.mentions,
        ...action.payload,
      };
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setOfflineMode: (state, action) => {
      state.offlineMode = action.payload;
    },
    resetStore: (state) => {
      return initialState;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.messageStatuses = {};
      state.error = null;
    },
  },
});

export const {
  addMessage,
  updateMessageStatus,
  setUserStatus,
  setTypingStatus,
  updateSettings,
  updateBotPersonality,
  updateVoiceSettings,
  updateMentionSettings,
  setError,
  clearError,
  setOfflineMode,
  resetStore,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer; 