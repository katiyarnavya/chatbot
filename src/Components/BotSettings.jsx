import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateBotPersonality } from '../store/chatSlice';

const BotSettings = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { botPersonality } = useSelector((state) => state.chat.settings);

  const handleChange = (field) => (event) => {
    dispatch(updateBotPersonality({ [field]: event.target.value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Bot Personality Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Bot Name"
            value={botPersonality.name}
            onChange={handleChange('name')}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Style</InputLabel>
            <Select
              value={botPersonality.style}
              onChange={handleChange('style')}
              label="Style"
            >
              <MenuItem value="friendly">Friendly</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Tone</InputLabel>
            <Select
              value={botPersonality.tone}
              onChange={handleChange('tone')}
              label="Tone"
            >
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
              <MenuItem value="humorous">Humorous</MenuItem>
              <MenuItem value="empathetic">Empathetic</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Response Length</InputLabel>
            <Select
              value={botPersonality.responseLength}
              onChange={handleChange('responseLength')}
              label="Response Length"
            >
              <MenuItem value="short">Short</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="long">Long</MenuItem>
              <MenuItem value="detailed">Detailed</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" color="text.secondary">
            These settings will affect how the bot responds to your messages.
            The bot will adapt its communication style based on these preferences.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BotSettings; 