import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Done, DoneAll } from '@mui/icons-material';

const MessageStatus = ({ status, isTyping }) => {
  if (isTyping) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
        <CircularProgress size={12} />
        <Typography variant="caption" color="text.secondary">
          Typing...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
      {status === 'sent' && <Done fontSize="small" color="action" />}
      {status === 'delivered' && <DoneAll fontSize="small" color="action" />}
      {status === 'read' && <DoneAll fontSize="small" color="primary" />}
    </Box>
  );
};

export default MessageStatus; 