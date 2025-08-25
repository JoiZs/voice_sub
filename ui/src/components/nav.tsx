"use client";

import { debounce } from "@/lib/debounce";
import { useRecorderStore, useWasmStore } from "@/lib/use_store";
import React, { ChangeEvent, useEffect } from "react";

const Nav = () => {
  const isRecording = useRecorderStore((s) => s.is_recording);
  const currDev = useRecorderStore((s) => s.inputDevice);
  const devOptions = useRecorderStore((s) => s.devOptions);
  const updateDevOptions = useRecorderStore((s) => s.updateDevOptions);
  const changeAudioInput = useRecorderStore((s) => s.changeInput);
  const startRecording = useRecorderStore((s) => s.startRecording);
  const stopRecording = useRecorderStore((s) => s.stopRecording);
  const wasmMem = useWasmStore((s) => s.memory);

  useEffect(() => {
    const updateAudioDevices = async () => {
      await navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .catch((err) =>
          console.log(`Err at accessing audio devices... ${err}`)
        );
      const inpDevices = await navigator.mediaDevices.enumerateDevices();

      updateDevOptions(inpDevices.filter((el) => el.kind == "audioinput"));
    };

    updateAudioDevices();
    return;
  }, []);

  const changeAudioHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    changeAudioInput(val);
  };

  const recordHandler = debounce(() => {
    if (isRecording) stopRecording();
    else {
      if (wasmMem) startRecording(wasmMem);
    }
  });

  return (
    <div className="flex flex-row text-xs gap-2 flex-wrap items-center py-2 w-full">
      <div className="flex-1">
        <select
          name="select_audio_input"
          onChange={changeAudioHandler}
          value={currDev}
        >
          <option value={""} hidden>
            Select default Audio
          </option>
          {devOptions.map((el) => (
            <option key={el.deviceId} value={el.deviceId}>
              {el.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button
          onClick={recordHandler}
          className={`${
            isRecording ? "bg-red-500" : "bg-teal-500"
          } text-white py-1 px-2 rounded-xl cursor-pointer`}
        >
          {!isRecording ? "Record" : "Stop"}
        </button>
      </div>
    </div>
  );
};

export default Nav;
