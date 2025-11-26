import React, { useEffect, useRef, useState } from 'react';
import { Button, ProgressBar } from 'react-bootstrap';

interface AudioPlayerProps {
  src: string;
  audioId?: number;
  lastPosition?: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, audioId, lastPosition = 0 }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    // Resume from last position if provided
    if (lastPosition > 0 && audioId) {
      const savedPosition = localStorage.getItem(`audio_position_${audioId}`);
      if (savedPosition) {
        audio.currentTime = parseFloat(savedPosition);
      }
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src, audioId, lastPosition]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Save position periodically
    if (audioId && isPlaying) {
      const interval = setInterval(() => {
        localStorage.setItem(`audio_position_${audioId}`, audio.currentTime.toString());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, audioId]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = parseFloat(e.target.value);
    setCurrentTime(audio.currentTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newRate = parseFloat(e.target.value);
    audio.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  const handleDownload = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const link = document.createElement('a');
    link.href = src;
    link.download = 'audiobook.mp3';
    link.click();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player p-3 border rounded">
      <audio ref={audioRef} src={src} />
      <div className="d-flex align-items-center mb-2">
        <Button variant="primary" onClick={togglePlayPause} className="me-2">
          {isPlaying ? '⏸' : '▶'}
        </Button>
        <span className="me-2">{formatTime(currentTime)}</span>
        <ProgressBar now={progress} style={{ flex: 1, height: '8px' }} className="me-2" />
        <span>{formatTime(duration)}</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center">
          <span className="me-2">🔊</span>
          <input
            type="range"
            className="form-range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            style={{ width: '100px' }}
          />
        </div>
        <select
          className="form-select"
          value={playbackRate}
          onChange={handleSpeedChange}
          style={{ width: '100px' }}
        >
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
        <Button variant="outline-secondary" size="sm" onClick={handleDownload}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayer;

