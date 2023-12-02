"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';

import { createPresignedUrl } from '@/lib/actions/create-presigned-url';
import { Loading } from '@/lib/components/Loading';
import { useBoolean } from '@/lib/use-boolean';

enum PlayState {
  Playing,
  Stopped,
}

export function AudioPreview({ fullname }: { fullname: string }) {
  const [loaded, { setTrue: isLoaded }] = useBoolean(false);
  const [working, { setTrue: startWorking, setFalse: stopWorking }] =
    useBoolean(false);

  const state = useRef<PlayState>(PlayState.Stopped);
  const [isPlaying, { setTrue: setIsPlaying, setFalse: setIsStopped }] =
    useBoolean(false);
  const [advancement, setAdvancement] = useState(0);

  const updateDiv = useCallback(() => {
    console.log("updating!");
    const audio = audioRef.current;
    if (audio === null) {
      return;
    }
    setAdvancement(Math.ceil((audio.currentTime * 100) / audio.duration));
    if (state.current == PlayState.Playing) {
      requestAnimationFrame(updateDiv);
    } else {
      console.log("not playing");
    }
  }, [state]);

  const playStarted = useCallback(() => {
    state.current = PlayState.Playing;
    setIsPlaying();
    updateDiv();
  }, [setIsPlaying, updateDiv]);

  const playStopped = useCallback(() => {
    state.current = PlayState.Stopped;
    setIsStopped();
  }, [setIsStopped]);

  const play = useCallback(() => {
    startWorking();
    createPresignedUrl(fullname)
      .then((u) => {
        const audio = audioRef.current!;
        audio.src = u;
        audio.play();
        audio.addEventListener("play", playStarted);
        audio.addEventListener("ended", playStopped);
        audio.addEventListener("complete", playStopped);
        audio.addEventListener("pause", playStopped);
        isLoaded();
      })
      .catch(console.error)
      .finally(stopWorking);
  }, [fullname, isLoaded, playStarted, playStopped, startWorking, stopWorking]);

  const pause = useCallback(() => {
    const audio = audioRef.current!;
    audio.pause();
  }, []);

  const resume = useCallback(() => {
    const audio = audioRef.current!;
    audio.play();
  }, []);

  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <span>
      <audio ref={audioRef} />
      {!loaded && !working && <FaPlay onClick={play} />}
      {working && <Loading />}
      {loaded && !working && (
        <div className="flex items-center gap-1">
          {isPlaying ? (
            <FaPause onClick={pause} />
          ) : (
            <FaPlay onClick={resume} />
          )}
          <div className="bg-slate-400 w-12 h-1">
            <div
              className="bg-slate-700 h-full"
              style={{ width: `${advancement}%` }}
            />
          </div>
        </div>
      )}
    </span>
  );
}
