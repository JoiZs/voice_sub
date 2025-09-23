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
import { ResultSegment } from "@/generated/rpc/service_pb";

type FFTConf = {
  size: number;
  maxDec: number;
  minDec: number;
  smoothTime: number;
};

export type TranscType = {
  longText: string;
  segments: Array<ResultSegment>;
};

export type RecordingType = {
  idx: string;
  duration: number;
  channel: number;
  sampleRate: number;
  recordedAt: number;
  transcript: TranscType | null;
};

export type RecorderState = {
  inputDevice: string;
  devOptions: MediaDeviceInfo[];
  is_recording: boolean;
  recorder?: MediaRecorder;
  currRecordedChunks: RecordingType[];
  fftConf: FFTConf;
  freqData: null | Float32Array;
};

export type RecoderActions = {
  updateDevOptions: (devs: MediaDeviceInfo[]) => void;
  changeInput: (dev: string) => void;
  startRecording: () => void;
  clearRecording: () => void;
  stopRecording: () => void;
  setupFreqData: (bufferLen: number) => Float32Array<ArrayBuffer>;
  setTranscript: (idx: string, trans: TranscType) => void;
  getTranscript: (idx: string) => TranscType | undefined | null;
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
  fftConf: {
    size: 128,
    minDec: -90,
    maxDec: 0,
    smoothTime: 0.85,
  },
  freqData: null,
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
        getTranscript: (idx: string) => {
          return get().currRecordedChunks.find((el) => el.idx == idx)
            ?.transcript;
        },
        setTranscript: (idx: string, trans: TranscType) => {
          set((state) => {
            const updatedOne = state.currRecordedChunks.find(
              (curr) => curr.idx == idx
            );

            if (!updatedOne) {
              return state;
            }

            updatedOne.transcript = trans;

            return {
              currRecordedChunks: [
                ...state.currRecordedChunks.filter((curr) => curr.idx !== idx),
                updatedOne,
              ],
            };
          });
        },
        setupFreqData: (bufferLen: number) => {
          const arrData = new Float32Array(bufferLen);
          set({
            freqData: arrData,
          });

          return arrData;
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

                analyzer.fftSize = get().fftConf.size;
                analyzer.maxDecibels = get().fftConf.maxDec;
                analyzer.minDecibels = get().fftConf.minDec;
                analyzer.smoothingTimeConstant = get().fftConf.smoothTime;
                source.connect(analyzer);

                const bufferLength = analyzer.frequencyBinCount;

                let animatedFrameCount: number;

                // let dataArray = mem.loadF32Array(ptr, bufferLength);
                let dataArray: Float32Array<ArrayBuffer>;

                if (
                  get().freqData == null ||
                  get().freqData?.length !== bufferLength
                ) {
                  dataArray = get().setupFreqData(bufferLength);
                }

                const processFreq = () => {
                  analyzer.getFloatFrequencyData(dataArray);

                  // if (dataArray[0] !== -Infinity) {
                  //   mem.exports.set_sound_mem(ptr, bufferLength);
                  // }

                  // console.log(dataArray);

                  animatedFrameCount = requestAnimationFrame(processFreq);
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
                    console.log(audio_ab);
                    console.log(audio_buffer.duration);

                    set((state) => ({
                      is_recording: false,
                      currRecordedChunks: [
                        ...state.currRecordedChunks,
                        {
                          idx: idx,
                          duration: audio_buffer.duration,
                          channel: audio_buffer.numberOfChannels,
                          sampleRate: audio_buffer.sampleRate,
                          recordedAt: Date.now(),
                          transcript: null,
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
                  stream.getTracks().forEach((track) => track.stop());
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

          set({ is_recording: false, recorder: undefined, freqData: null });
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
