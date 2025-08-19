"use client";

import { createStore } from "zustand";
import {
  get as dbget,
  set as dbset,
  del,
  createStore as createIdbStore,
} from "idb-keyval";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { SetRecording } from "./recordings-store";

export type RecorderState = {
  inputDevice: string;
  devOptions: MediaDeviceInfo[];
  is_recording: boolean;
  recorder?: MediaRecorder;
  currRecordedChunks: string[];
};

export type RecoderActions = {
  updateDevOptions: (devs: MediaDeviceInfo[]) => void;
  changeInput: (dev: string) => void;
  startRecording: () => void;
  clearRecording: () => void;
  stopRecording: () => void;
};

export type RecorderStore = RecorderState & RecoderActions;

const recStore = createIdbStore("rec_db", "conf_info");

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, "has been retrived.");
    return (await dbget(name, recStore)) || null;
  },
  setItem: async (name: string, value): Promise<void> => {
    console.log(name, " with value ", value, " has been saved.");
    await dbset(name, value, recStore);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "has been deleted.");
    await del(name, recStore);
  },
};

export const defaultInitState: RecorderState = {
  inputDevice: "",
  devOptions: [],
  is_recording: false,
  recorder: undefined,
  currRecordedChunks: [],
};

export const createRecorderStore = (
  initState: RecorderState = defaultInitState
) => {
  return createStore<RecorderStore>()(
    persist(
      (set, get) => ({
        ...initState,
        updateDevOptions: async (devs: MediaDeviceInfo[]) => {
          set({ devOptions: devs });
        },
        changeInput: async (dev: string) => {
          set({ inputDevice: dev });
        },
        startRecording: async () => {
          await navigator.mediaDevices
            .getUserMedia({
              audio: { deviceId: get().inputDevice },
              video: false,
            })
            .then((stream) => {
              const tracks = stream.getAudioTracks();
              if (tracks.length <= 0) {
                console.log("No media track found...");
                return;
              }

              if (tracks[0].readyState == "live") {
                const mediaRecoder = new MediaRecorder(stream);
                const audioCtx = new AudioContext();
                const analyzer = audioCtx.createAnalyser();
                const source = audioCtx.createMediaStreamSource(stream);

                analyzer.fftSize = 2048;
                const bufferLength = analyzer.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                source.connect(analyzer);

                let animatedFrameCount: number;

                const processFreq = () => {
                  animatedFrameCount = requestAnimationFrame(processFreq);
                  analyzer.getByteFrequencyData(dataArray);
                  console.log(dataArray);
                };

                processFreq();

                set({ is_recording: true, recorder: mediaRecoder });

                console.log("Started recording...");
                mediaRecoder.start();

                const recordDataEntryHandler = async (e: BlobEvent) => {
                  if (e.data && e.data.size > 0) {
                    const idx = await SetRecording(e.data);

                    set((state) => ({
                      currRecordedChunks: [...state.currRecordedChunks, idx],
                    }));
                    console.log("curr blob: ", e.data);
                  }
                };

                mediaRecoder.addEventListener(
                  "dataavailable",
                  recordDataEntryHandler
                );

                mediaRecoder.onstop = () => {
                  mediaRecoder.removeEventListener(
                    "dataavailable",
                    recordDataEntryHandler
                  );
                  cancelAnimationFrame(animatedFrameCount);
                };
              }
            });
        },
        stopRecording: () => {
          const mediaRecorder = get().recorder;
          if (!mediaRecorder) {
            set({ is_recording: false });
            console.log("No recorder found...");
            return;
          }

          console.log("Stopped the recording...");
          mediaRecorder.stop();

          set({ is_recording: false, recorder: undefined });
        },
        clearRecording: () => {
          set({ is_recording: false, recorder: undefined });
        },
      }),
      {
        name: "recorder-storage",
        storage: createJSONStorage(() => storage),
      }
    )
  );
};
