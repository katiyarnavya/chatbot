import axios from 'axios';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const sendMessage = async (message, settings) => {
  try {
    // Directly use the Gemini 1.5 Flash model
    const response = await api.post('/models/gemini-1.5-flash:generateContent', {
      contents: [{
        role: 'user',
        parts: [{
          text: `You are a helpful AI assistant. Your personality: ${settings.botPersonality.style}, tone: ${settings.botPersonality.tone}, response length: ${settings.botPersonality.responseLength}. User message: ${message}`
        }]
      }],
      generationConfig: {
        temperature: settings.temperature || 0.7,
        maxOutputTokens: settings.maxOutputTokens || 1000,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }, {
      params: {
        key: API_KEY
      }
    });

    return {
      type: 'text',
      text: response.data.candidates[0].content.parts[0].text
    };
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);

    // Helpful error handling for deprecated models
    if (error.response?.data?.error?.message?.includes('deprecated')) {
      console.warn(
        'Warning: This model has been deprecated. ' +
        'Consider switching to the latest recommended model (gemini-1.5-flash).'
      );
    }

    throw new Error(
      error.response?.data?.error?.message ||
      'Failed to get response from bot'
    );
  }
};

export const sendVoiceMessage = async (audioBlob, settings) => {
  try {
    const transcriptionResponse = await axios.post(
      `${BASE_URL}/speech:recognize?key=${API_KEY}`,
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
          'Content-Type': 'application/json'
        }
      }
    );

    const transcribedText = transcriptionResponse.data.results[0].alternatives[0].transcript;
    const chatResponse = await sendMessage(transcribedText, settings);

    return chatResponse;
  } catch (error) {
    console.error('Voice API Error:', error.response ? error.response.data : error.message);
    throw new Error(
      error.response?.data?.error?.message ||
      'Failed to process voice message'
    );
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
