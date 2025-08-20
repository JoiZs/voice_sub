import { GetRecording } from "@/stores/recordings-store";
import React from "react";
import { RecordingType } from "@/stores/recoder-store";

type Props = {
  recording_idx: RecordingType[];
};

const DisplayRecording = (props: Props) => {
  return (
    <>
      {props.recording_idx.map((el, idx) => {
        // const blobData = await GetRecording(el);
        console.log(el);

        return (
          <div
            key={el.idx}
            className="flex flex-col gap-2 hover:text-teal-500 cursor-pointer"
          >
            <span>Recording {idx + 1}</span>
            <div className="flex flex-row justify-between text-xs font-semibold">
              <span>{new Date(el.recordedAt).toLocaleDateString()}</span>
              <span>{el.duration} s</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DisplayRecording;
