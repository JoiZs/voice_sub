import { useRecorderStore } from "@/lib/use_store";
import { TranscType } from "@/stores/recoder-store";
import React, { useEffect, useState } from "react";

type Props = { idx: string };

const TranscriptDisplay = (props: Props) => {
  const [currTranscript, setCurrTranscript] = useState<TranscType | null>(null);
  const getTransc = useRecorderStore((s) => s.getTranscript);

  useEffect(() => {
    return () => {
      const transc = getTransc(props.idx);
      if (transc) setCurrTranscript(transc);
    };
  }, [props.idx]);

  console.log(currTranscript);

  return (
    <div className="font-mono text-center text-xs">
      {currTranscript ? (
        currTranscript.segments.length <= 0 ? (
          <span className="text-red-600">
            No transcript found in the audio.
          </span>
        ) : (
          <span className="text-teal-600 text-wrap">
            {currTranscript.longText}
          </span>
        )
      ) : (
        <span className="text-red-600">
          Audio has not yet been transcribed.
        </span>
      )}
    </div>
  );
};

export default TranscriptDisplay;
