"use client";

import { debounce } from "@/lib/debounce";
import { GetRecording } from "@/stores/recordings-store";
import React, { useEffect, useState } from "react";

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
  const audioCtx = new AudioContext();

  useEffect(() => {
    let cancelled = false;
    GetRecording(idx).then((data) => {
      if (!cancelled) setBlobData(data);
    });
    return () => {
      cancelled = true;
    };
  }, [idx]);

  console.log(blobData);

  const playHandler = debounce(async () => {
    setPlayerConf((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
    console.log(blobData, playerConf);
    if (!playerConf.isPlaying && blobData) {
      const audioBuffer = await audioCtx.decodeAudioData(
        await blobData.arrayBuffer()
      );
      console.log(audioBuffer);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;

      source.connect(audioCtx.destination);
      source.start(0);

      setPlayerConf((prev) => ({ ...prev, audioSource: source }));
    } else if (playerConf.isPlaying && playerConf.audioSource) {
      playerConf.audioSource.stop();
      setPlayerConf((prev) => ({ ...prev, audioSource: undefined }));
    }
  });

  return (
    <div className="flex flex-row items-center gap-2 text-xs font-semibold py-4">
      <button onClick={playHandler} className="cursor-pointer">
        {playerConf.isPlaying ? "Pause" : "Play"}
      </button>
      <input type="range" />
    </div>
  );
};

export default Player;
