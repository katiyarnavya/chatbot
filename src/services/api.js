import axios from 'axios';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-goog-api-key': API_KEY
  }
});

export const sendMessage = async (message, settings) => {
  try {
    const response = await api.post('', {
      contents: [{
        parts: [{
          text: `You are a helpful AI assistant. Your personality: ${settings.botPersonality.style}, tone: ${settings.botPersonality.tone}, response length: ${settings.botPersonality.responseLength}. User message: ${message}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    return {
      type: 'text',
      text: response.data.candidates[0].content.parts[0].text
    };
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to get response from bot');
  }
};

export const sendVoiceMessage = async (audioBlob, settings) => {
  try {
    // First, convert speech to text using Google Cloud Speech-to-Text API
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const transcriptionResponse = await axios.post(
      'https://speech.googleapis.com/v1/speech:recognize',
      {
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'en-US',
        },
        audio: {
          content: await convertBlobToBase64(audioBlob)
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY
        }
      }
    );

    const transcribedText = transcriptionResponse.data.results[0].alternatives[0].transcript;

    // Then, get AI response using the transcribed text
    const chatResponse = await sendMessage(transcribedText, settings);

    return chatResponse;
  } catch (error) {
    console.error('Voice API Error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to process voice message');
  }
};

// Helper function to convert Blob to base64
const convertBlobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default api; 