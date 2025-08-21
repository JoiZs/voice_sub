import React, { useState } from "react";
import { RecordingType } from "@/stores/recoder-store";
import Player from "./player";

type Props = {
  recording_idx: RecordingType[];
};

const DisplayRecording = (props: Props) => {
  const [focusRecording, setFocusRecording] = useState<string | null>(null);

  return (
    <>
      {props.recording_idx.map((el, idx) => {
        console.log(el);

        return (
          <div key={el.idx}>
            <div
              onClick={() => {
                if (el.idx != focusRecording) {
                  setFocusRecording(el.idx);
                } else {
                  setFocusRecording(null);
                }
              }}
              className="flex flex-col gap-2 hover:text-teal-500 cursor-pointer"
            >
              <span>Recording {idx + 1}</span>
              <div className="flex flex-row justify-between text-xs font-semibold">
                <span>{new Date(el.recordedAt).toLocaleDateString()}</span>
                <span>{el.duration} s</span>
              </div>
            </div>
            {el.idx == focusRecording && <Player idx={el.idx} />}
          </div>
        );
      })}
    </>
  );
};

export default DisplayRecording;
