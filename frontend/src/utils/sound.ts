/* eslint-disable prettier/prettier */
import { useState, useEffect, useCallback } from "react";
import { Howl } from "howler";

interface UseAudioPlayerOptions {
  url: string;
  isUpdated: boolean;
}

export const useAudioPlayer = ({ url, isUpdated }: UseAudioPlayerOptions) => {
  const [player, setPlayer] = useState<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seek, setSeek] = useState<number>(0);
  const [duration, setDuration] = useState<number | undefined>(0);
  const [howls, setHowls] = useState<Record<string, Howl>>({});

  useEffect(() => {
    let howlPlayer: Howl;

    if (howls[url] === undefined) {
      if (player) player.stop();
      howlPlayer = new Howl({
        src: [url],
        format: ["mp3"],
        autoplay: true,
        loop: false,
        html5: false,
        preload: true,
        onplay: () => {
          setIsPlaying(true);
          setDuration(howlPlayer.duration());
        },
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onend: () => setIsPlaying(false),
      });
      setHowls({ ...howls, [url]: howlPlayer });
      console.log("load>", url, Object.keys(howls));
    } else {
      if (player) player.stop();
      howlPlayer = howls[url];
    }
    setPlayer(howlPlayer);
    setSeek(0);
    howlPlayer.play();
    setDuration(undefined);
  }, [url, isUpdated]);

  const play = useCallback(() => {
    player?.play();
  }, [player]);

  const pause = useCallback(() => {
    player?.pause();
  }, [player]);

  const togglePlayPause = useCallback(() => {
    if (player) {
      isPlaying ? player.pause() : player.play();
    }
  }, [player, isPlaying]);

  const setVolume = useCallback(
    (volume: number) => {
      if (player) {
        player.volume(volume / 100);
      } else {
        console.log("Player not initialized");
      }
    },
    [player]
  );

  const setTime = useCallback(
    (time: number) => {
      if (player) {
        setSeek(time);
        player.seek(time);
      } else {
        console.log("Player not initialized");
      }
    },
    [player]
  );

  const reStart = useCallback(() => {
    if (player) {
      player.stop();
      player.play();
      setSeek(0);
    } else {
      console.log("Player not initialized", seek);
    }
  }, [player]);

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined;

    const updateSeek = () => {
      const currentTime = player?.seek();
      if (typeof currentTime === "number") {
        setSeek(currentTime);
      }
    };

    if (player && isPlaying) {
      intervalId = setInterval(updateSeek, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [player, isPlaying]);

  return {
    isPlaying,
    play,
    pause,
    togglePlayPause,
    seek,
    duration,
    setVolume,
    reStart,
    setTime,
  };
};
