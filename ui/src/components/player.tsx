"use client";

import { debounce } from "@/lib/debounce";
import { GetRecording } from "@/stores/recordings-store";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  idx: string;
};

type PlayerConf = {
  isPlaying: boolean;
  audioSource?: AudioBufferSourceNode;
};

const Player = ({ idx }: Props) => {
  const [blobData, setBlobData] = useState<null | Blob>(null);
  const [playerConf, setPlayerConf] = useState<PlayerConf>({
    isPlaying: false,
    audioSource: undefined,
  });

  const audioCtxRef = useRef<AudioContext>(null);

  useEffect(() => {
    let cancelled = false;
    GetRecording(idx).then((data) => {
      if (!cancelled) setBlobData(data);
    });
    return () => {
      cancelled = true;
    };
  }, [idx]);

  const playHandler = debounce(async () => {
    console.log(playerConf);
    // setPlayerConf((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }

    const audioCtx = audioCtxRef.current;

    if (!playerConf.isPlaying && blobData) {
      const audioBuffer = await audioCtx.decodeAudioData(
        await blobData.arrayBuffer()
      );
      console.log(audioBuffer);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;

      source.connect(audioCtx.destination);
      source.start(0);

      setPlayerConf((prev) => ({
        ...prev,
        audioSource: source,
        isPlaying: true,
      }));

      source.onended = () => {
        setPlayerConf((prev) => ({
          ...prev,
          isPlaying: false,
          audioSource: undefined,
        }));
      };
    } else if (playerConf.isPlaying && playerConf.audioSource) {
      playerConf.audioSource.stop();
      setPlayerConf((prev) => ({
        ...prev,
        audioSource: undefined,
        isPlaying: false,
      }));
    }
  });

  return (
    // <div className="flex flex-row items-center gap-2 text-xs font-semibold p-4 bg-teal-500">
    <button
      onClick={playHandler}
      className="cursor-pointer text-xs font-semibold p-4 bg-teal-500 text-white"
    >
      {playerConf.isPlaying ? "Pause" : "Play"}
    </button>
    // </div>
  );
};

export default Player;
