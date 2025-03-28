import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import { Mic, Stop, PlayArrow, Pause, Send } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const VoiceMessage = ({ onSend }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);
  const { settings } = useSelector((state) => state.chat);
  const { voiceSettings } = settings;

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        audioRef.current.src = url;
        audioRef.current.onloadedmetadata = () => {
          setDuration(audioRef.current.duration);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSliderChange = (event, newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const sendVoiceMessage = () => {
    if (chunksRef.current.length > 0) {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      onSend(blob, 'voice');
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {!isRecording && !audioRef.current?.src ? (
        <IconButton onClick={startRecording} color="primary">
          <Mic />
        </IconButton>
      ) : isRecording ? (
        <>
          <IconButton onClick={stopRecording} color="error">
            <Stop />
          </IconButton>
          <Typography variant="body2">Recording...</Typography>
        </>
      ) : (
        <>
          <IconButton onClick={isPlaying ? pauseAudio : playAudio} color="primary">
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption">{formatTime(currentTime)}</Typography>
            <Slider
              value={currentTime}
              max={duration}
              onChange={handleSliderChange}
              sx={{ flex: 1 }}
            />
            <Typography variant="caption">{formatTime(duration)}</Typography>
          </Box>
          <IconButton onClick={sendVoiceMessage} color="primary">
            <Send />
          </IconButton>
        </>
      )}
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} />
    </Box>
  );
};

export default VoiceMessage; 