import { useState, useRef } from 'react';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = async (text: string, lang: string = 'en-US') => {
    if ('speechSynthesis' in window) {
      setIsLoading(true);
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const playAudioUrl = async (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsLoading(true);
    
    try {
      audioRef.current = new Audio(url);
      audioRef.current.onloadstart = () => setIsLoading(true);
      audioRef.current.oncanplay = () => setIsLoading(false);
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
      };
      
      await audioRef.current.play();
    } catch (error) {
      setIsLoading(false);
      setIsPlaying(false);
      console.error('Audio play failed:', error);
    }
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  return {
    speak,
    playAudioUrl,
    stop,
    isPlaying,
    isLoading
  };
};