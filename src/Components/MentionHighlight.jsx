import React from 'react';
import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';

const MentionHighlight = ({ text }) => {
  // If text is not a string, convert it to string or return empty string
  const textContent = typeof text === 'string' ? text : String(text || '');

  // Split text into parts based on mentions
  const parts = textContent.split(/(@\w+)/g);

  return (
    <Box>
      {parts.map((part, index) => {
        if (part.startsWith('@')) {
          // This is a mention
          return (
            <Box
              key={index}
              component="span"
              sx={{
                backgroundColor: 'rgba(29, 155, 240, 0.1)',
                borderRadius: '4px',
                padding: '0 4px',
                color: '#1d9bf0',
                fontWeight: 500,
              }}
            >
              {part}
            </Box>
          );
        }
        // This is regular text
        return (
          <Box key={index} component="span">
            <ReactMarkdown>{part}</ReactMarkdown>
          </Box>
        );
      })}
    </Box>
  );
};

export default MentionHighlight; 