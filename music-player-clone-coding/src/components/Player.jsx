import { useEffect, useState } from "react";
import useSound from "use-sound"; // for handling the sound
import airbag from "../assets/media/01. Airbag.mp3"; // importing the music
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // icons for next and previous track
import { IconContext } from "react-icons"; // for customazing the icons

import classes from "./Player.module.css";

const DUMMY_MUSIC_DATA = {
  musician: "Radiohead",
  albumName: "OK Computer",
  trackName: "Airbag",
  albumCoverUrl:
    "https://lastfm.freetls.fastly.net/i/u/770x0/62d26c6cb4ac4bdccb8f3a2a0fd55421.jpg",
  altDescription: "Airbag by Radiohead",
};

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, duration, sound }] = useSound(airbag);

  const [currTime, setCurrTime] = useState({
    min: "0",
    sec: "00",
  });

  const [seconds, setSeconds] = useState();

  const sec = duration / 1000;
  const min = Math.floor(sec / 60);
  const secRemain = Math.floor(sec % 60);
  const time = {
    min: min,
    sec: secRemain,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([])); // setting the seconds state with the current state
        const min = Math.floor(sound.seek([]) / 60);
        const sec = Math.floor(sound.seek([]) % 60);
        setCurrTime({
          min,
          sec,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  const playingButton = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={classes.component}>
      <h2>Playing Now</h2>
      <img
        className={classes.musicCover}
        src={DUMMY_MUSIC_DATA.albumCoverUrl}
        alt={DUMMY_MUSIC_DATA.altDescription}
      />
      <div>
        <h3 className={classes.title}>{DUMMY_MUSIC_DATA.trackName}</h3>
        <p className={classes.subTitle}>{DUMMY_MUSIC_DATA.musician}</p>
      </div>
      <div>
        <div className={classes.time}>
          <p>
            {currTime.min}:{String(currTime.sec).padStart(2, "0")}
          </p>
          <p>
            {time.min}:{String(time.sec).padStart(2, "0")}
          </p>
        </div>
        <input
          type="range"
          min="0"
          max={duration / 1000}
          default="0"
          value={seconds}
          className={classes.timeline}
          onChange={(e) => {
            sound.seek([e.target.value]);
          }}
        />
      </div>
      <div>
        <button className={classes.playButton}>
          <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
            <BiSkipPrevious />
          </IconContext.Provider>
        </button>
        {!isPlaying ? (
          <button className={classes.playButton} onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPlayCircle />
            </IconContext.Provider>
          </button>
        ) : (
          <button className={classes.playButton} onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPauseCircle />
            </IconContext.Provider>
          </button>
        )}
        <button className={classes.playButton}>
          <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
            <BiSkipNext />
          </IconContext.Provider>
        </button>
      </div>
    </div>
  );
};

export default Player;
