"use client";

import { useRecorderStore } from "@/lib/use_store";
import React, { ChangeEvent, useEffect } from "react";

type Props = {};

const Nav = (props: Props) => {
  const currDev = useRecorderStore((s) => s.inputDevice);
  const devOptions = useRecorderStore((s) => s.devOptions);
  const updateDevOptions = useRecorderStore((s) => s.updateDevOptions);
  const changeAudioInput = useRecorderStore((s) => s.changeInput);

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

  return (
    <div>
      <div className="text-xs">
        <select onChange={changeAudioHandler} value={currDev}>
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
    </div>
  );
};

export default Nav;
