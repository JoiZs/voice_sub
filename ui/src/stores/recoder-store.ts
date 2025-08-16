import { createStore } from "zustand";
import { get, set as dbset } from "idb-keyval";

export type RecorderState = {
  inputDevice?: string;
};

export type RecoderActions = {
  changeInput: (dev: string) => void;
  startRecording: () => void;
  clearRecording: () => void;
};

export type RecorderStore = RecorderState & RecoderActions;

export const defaultInitState: RecorderState = {
  inputDevice: (await get("rec_dev_id")) || undefined,
};

export const createRecorderStore = (
  initState: RecorderState = defaultInitState
) => {
  return createStore<RecorderStore>()((set, get) => ({
    ...initState,
    changeInput: async (dev: string) => {
      await dbset("rec_dev_id", dev);
      set({ inputDevice: dev });
    },
    startRecording: () => {},
    clearRecording: () => {},
  }));
};
