import { createStore } from "zustand";

export type RecorderState = {
  inputDevice?: string;
};

export type RecoderActions = {
  changeInput: () => void;
  startRecording: () => void;
  clearRecording: () => void;
};

export type RecorderStore = RecorderState & RecoderActions;

export const defaultInitState: RecorderState = { inputDevice: undefined };

export const createRecorderStore = (
  initState: RecorderState = defaultInitState
) => {
  return createStore<RecorderStore>()((set, get) => ({
    ...initState,
    changeInput: () => {},
    startRecording: () => {},
    clearRecording: () => {},
  }));
};
