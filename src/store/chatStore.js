import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [],
      userStatus: 'active',
      isTyping: false,
      messageStatuses: {}, // Track message statuses (sent, delivered, read)
      settings: {
        theme: 'light',
        characterLimit: 500,
        showTypingIndicator: true,
        showReadReceipts: true,
      },
      
      // Actions
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
      })),
      
      updateMessageStatus: (messageId, status) => set((state) => ({
        messageStatuses: {
          ...state.messageStatuses,
          [messageId]: status,
        },
      })),
      
      setUserStatus: (status) => set({ userStatus: status }),
      
      setTypingStatus: (isTyping) => set({ isTyping }),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
      
      downloadChatHistory: () => {
        const state = get();
        const history = JSON.stringify(state.messages, null, 2);
        const blob = new Blob([history], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },

      // Reset store to initial state
      resetStore: () => set({
        messages: [],
        userStatus: 'active',
        isTyping: false,
        messageStatuses: {},
        settings: {
          theme: 'light',
          characterLimit: 500,
          showTypingIndicator: true,
          showReadReceipts: true,
        },
      }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        settings: state.settings,
      }),
    }
  )
);

export default useChatStore; 