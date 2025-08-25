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
import { WasmMemoryInterface } from "@/lib/wasm_runtime";

export type RecordingType = {
  idx: string;
  duration: number;
  channel: number;
  sampleRate: number;
  recordedAt: number;
};

export type RecorderState = {
  inputDevice: string;
  devOptions: MediaDeviceInfo[];
  is_recording: boolean;
  recorder?: MediaRecorder;
  currRecordedChunks: RecordingType[];
};

export type RecoderActions = {
  updateDevOptions: (devs: MediaDeviceInfo[]) => void;
  changeInput: (dev: string) => void;
  startRecording: (mem: WasmMemoryInterface) => void;
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
        startRecording: async (mem: WasmMemoryInterface) => {
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

                analyzer.fftSize = 512;
                const ptr = 1024;
                const bufferLength = analyzer.frequencyBinCount;

                const currMemLen = mem.mem.byteLength;
                const memRequired = Math.max(0, 4 * bufferLength - currMemLen);
                const pageRequired = Math.ceil((ptr + memRequired) / 65536);

                mem.exports.allc_data_size(currMemLen);

                if (pageRequired > 0) {
                  try {
                    mem.memory.grow(pageRequired);
                    console.log(
                      "Memory grown successfully, pages: ",
                      pageRequired
                    );
                  } catch (e) {
                    console.log("Failed to grow memory:", e);
                  }
                }

                const dataArray = mem.loadF32Array(ptr, bufferLength);

                // const dataArray = new Uint8Array(bufferLength);

                source.connect(analyzer);

                let animatedFrameCount: number;

                const processFreq = () => {
                  animatedFrameCount = requestAnimationFrame(processFreq);
                  analyzer.getFloatFrequencyData(dataArray);

                  if (dataArray[0] != Infinity)
                    mem.exports.set_sound_mem(ptr, bufferLength);

                  console.log(dataArray);
                };

                processFreq();

                set({ is_recording: true, recorder: mediaRecoder });

                console.log("Started recording...");
                mediaRecoder.start();

                const recordDataEntryHandler = async (e: BlobEvent) => {
                  if (e.data && e.data.size > 0) {
                    const idx = await SetRecording(e.data);

                    const audio_ab = await e.data.arrayBuffer();
                    const audio_buffer = await audioCtx.decodeAudioData(
                      audio_ab
                    );
                    console.log(audio_buffer.duration);

                    set((state) => ({
                      currRecordedChunks: [
                        ...state.currRecordedChunks,
                        {
                          idx: idx,
                          duration: audio_buffer.duration,
                          channel: audio_buffer.numberOfChannels,
                          sampleRate: audio_buffer.sampleRate,
                          recordedAt: Date.now(),
                        },
                      ],
                    }));
                    console.log("curr blob: ", e.data);
                  }
                };

                mediaRecoder.addEventListener(
                  "dataavailable",
                  recordDataEntryHandler
                );

                mediaRecoder.onstop = async () => {
                  mediaRecoder.removeEventListener(
                    "dataavailable",
                    recordDataEntryHandler
                  );
                  await audioCtx.close();
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
