import React, { useEffect, useRef, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaForward,
  FaBackward,
} from "react-icons/fa";
import "./styles.css";

function AudioPlayer({ displayImage, audioFile, title }) {
  const audioRef = useRef();
  const volumeRef = useRef();
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);

  // handling audio

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioFile]);

  useEffect(() => {
    setIsPlaying(true);
    audioRef.current.play();
  }, [audioFile]);

  useEffect(() => {
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying]);

  function handleTimeUpdate() {
    setCurrentTime(audioRef.current.currentTime);
  }

  function handleLoadedMetaData() {
    setAudioDuration(audioRef.current.duration);
  }

  function handleEnded() {
    setCurrentTime(0);
    setIsPlaying(false);
  }

  function formatTime(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  // handling volume

  function handleAudioDuration(e) {
    setCurrentTime(e.target.value);
    audioRef.current.currentTime = e.target.value;
  }

  function handleForwardSkip() {
    setCurrentTime(currentTime + 10);
    audioRef.current.currentTime = currentTime + 10;
  }

  function handleBackwardSkip() {
    setCurrentTime(currentTime - 10);
    audioRef.current.currentTime = currentTime - 10;
  }

  useEffect(() => {
    // isMute ? (audioRef.current.volume=0) : audioRef.current.volume=volume;
    if (isMute) {
      audioRef.current.volume = 0;
      volumeRef.current.value = 0;
    } else {
      if (volume == 0 || !volume) {
        setVolume(0.5);
        volumeRef.current.value = 0.5;
        audioRef.current.volume = 0.5;
        return;
      }
      audioRef.current.volume = volume;
      volumeRef.current.value = volume;
    }
  }, [isMute]);

  function handleVolume(e) {
    if (e.target.value == 0) {
      setIsMute(true);
    } else {
      setIsMute(false);
    }
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value;
  }

  return (
    <>
      <div className="audio-player-div">
        {/* <p>{title}</p> */}
        <img src={displayImage} alt={title} className="audio-player-img" />
        <audio ref={audioRef} src={audioFile}></audio>
        <div className="audio-range-div">
          <p
            onClick={() => setIsPlaying(!isPlaying)}
            className="audio-player-btn"
          >
            {isPlaying ? <FaPause title="Pause" /> : <FaPlay title="Play" />}
          </p>
          <p className="audio-player-btn" onClick={handleBackwardSkip}>
            <FaBackward title="Rewind 10s" />
          </p>
          <div>{formatTime(currentTime)}</div>
          <input
            type="range"
            className="audio-range"
            min={0}
            max={audioDuration}
            step={0.01}
            onChange={handleAudioDuration}
            value={currentTime}
          />
          <div>-{formatTime(audioDuration - currentTime)}</div>
          <p className="audio-player-btn" onClick={handleForwardSkip}>
            <FaForward title="Skip 10s" />
          </p>
        </div>
        <div className="volume-range-div">
          <p onClick={() => setIsMute(!isMute)} className="audio-player-btn">
            {isMute || !volume || volume == 0 ? (
              <FaVolumeMute title="Unmute" />
            ) : (
              <FaVolumeUp title="Mute" />
            )}
          </p>
          <input
            ref={volumeRef}
            min={0}
            max={1}
            step={0.01}
            type="range"
            className="volume-range"
            onChange={handleVolume}
            title="Adjust Volume"
          />
          <p>{isMute ? "0" : parseInt(volume * 100)}%</p>
        </div>
      </div>

      {/* mobile */}

      <div className="audio-player-div-mobile">
        {/* <p>{title}</p> */}
        <img src={displayImage} alt={title} className="audio-player-img" />
        <audio ref={audioRef} src={audioFile}></audio>
        <div className="audio-range-div-mobile">
          <div className="audio-buttons">
            <p className="audio-player-btn" onClick={handleBackwardSkip}>
              <FaBackward title="Rewind 10s" />
            </p>
            <p
              onClick={() => setIsPlaying(!isPlaying)}
              className="audio-player-btn"
            >
              {isPlaying ? <FaPause title="Pause" /> : <FaPlay title="Play" />}
            </p>
            <p className="audio-player-btn" onClick={handleForwardSkip}>
              <FaForward title="Skip 10s" />
            </p>
          </div>
          <div className="range-div">
            <div>{formatTime(currentTime)}</div>
            <input
              type="range"
              className="audio-range"
              min={0}
              max={audioDuration}
              step={0.01}
              onChange={handleAudioDuration}
              value={currentTime}
            />
            <div>-{formatTime(audioDuration - currentTime)}</div>
          </div>
        </div>
        <div className="volume-range-div-mobile">
          <p onClick={() => setIsMute(!isMute)} className="audio-player-btn">
            {isMute || !volume || volume == 0 ? (
              <FaVolumeMute title="Unmute" />
            ) : (
              <FaVolumeUp title="Mute" />
            )}
          </p>
          <div className="vol-range-percent">
          <input
            ref={volumeRef}
            min={0}
            max={1}
            step={0.01}
            type="range"
            className="volume-range"
            onChange={handleVolume}
            title="Adjust Volume"
          />
          <p className="volume-percentage">{isMute ? "0" : parseInt(volume * 100)}%</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AudioPlayer;
