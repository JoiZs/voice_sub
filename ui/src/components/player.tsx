"use client";

import { AudioFileInfo } from "@/generated/rpc/service_pb";
import { AudioSTTServiceClient } from "@/generated/rpc/ServiceServiceClientPb";
import { debounce } from "@/lib/debounce";
import { useRecorderStore } from "@/lib/use_store";
import { GetRecording } from "@/stores/recordings-store";
import { createClient } from "@/utils/rpc_client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  idx: string;
};

type PlayerConf = {
  isPlaying: boolean;
  audioSource?: AudioBufferSourceNode;
};

const Player = ({ idx }: Props) => {
  const setTransc = useRecorderStore((store) => store.setTranscript);
  const currChunk = useRecorderStore((store) =>
    store.currRecordedChunks.find((curr) => curr.idx)
  );

  const [blobData, setBlobData] = useState<null | Blob>(null);
  const [playerConf, setPlayerConf] = useState<PlayerConf>({
    isPlaying: false,
    audioSource: undefined,
  });

  const audioCtxRef = useRef<AudioContext>(null);
  const sttClientRef = useRef<AudioSTTServiceClient>(null);

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

    if (!sttClientRef.current) {
      sttClientRef.current = createClient();
    }

    const audioCtx = audioCtxRef.current;

    if (!playerConf.isPlaying && blobData) {
      const uarr = await blobData.arrayBuffer();

      // transcribe the audio
      if (currChunk && !currChunk.transcript) {
        const sstRequest = new AudioFileInfo();

        sstRequest.setAudioBuff(new Uint8Array(uarr));

        sttClientRef.current.sendAudio(sstRequest, {}, (err, res) => {
          if (!err || !res.getEMessage()) {
            const currResTransc = res.getResMessage();

            if (!currResTransc) {
              console.log("No transcript response...");
              return;
            }
            console.log(currResTransc.getSegmentsList());
            setTransc(idx, {
              longText: currResTransc.getLongText(),
              segments: currResTransc.getSegmentsList(),
            });
          }
        });
      }

      console.log("audiobuff: ", uarr);

      const audioBuffer = await audioCtx.decodeAudioData(uarr);

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

  if (!currChunk) {
    return <span>No recording found...</span>;
  }

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
