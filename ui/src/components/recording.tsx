import React, { useCallback, useState } from "react";
import { RecordingType } from "@/stores/recoder-store";
import Player from "./player";

type Props = {
  recording_idx: RecordingType[];
};

const DisplayRecording = (props: Props) => {
  const [focusRecording, setFocusRecording] = useState<string | null>(null);

  const focusHandler = (idx: string) => {
    if (idx != focusRecording) {
      setFocusRecording(idx);
    } else {
      setFocusRecording(null);
    }
  };

  return (
    <>
      {props.recording_idx.map((el, idx) => {
        console.log(el);

        return (
          <div className="flex gap-2 flex-row w-full" key={el.idx}>
            <div
              onClick={() => focusHandler(el.idx)}
              className="flex-1 flex flex-col gap-2 hover:text-teal-500 cursor-pointer"
            >
              <span>Recording {idx + 1}</span>
              <div className="flex flex-row justify-between text-xs font-semibold">
                <span>{new Date(el.recordedAt).toLocaleDateString()}</span>
                <span>{el.duration} s</span>
              </div>
              <div></div>
            </div>
            {el.idx == focusRecording && <Player idx={focusRecording} />}
          </div>
        );
      })}
    </>
  );
};

export default DisplayRecording;
