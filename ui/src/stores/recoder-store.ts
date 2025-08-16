import { createStore } from "zustand";
import { get, set as dbset, del } from "idb-keyval";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";

export type RecorderState = {
  inputDevice: string;
  devOptions: MediaDeviceInfo[];
};

export type RecoderActions = {
  updateDevOptions: (devs: MediaDeviceInfo[]) => void;
  changeInput: (dev: string) => void;
  startRecording: () => void;
  clearRecording: () => void;
};

export type RecorderStore = RecorderState & RecoderActions;

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, "has been retrived.");
    return (await get(name)) || null;
  },
  setItem: async (name: string, value): Promise<void> => {
    console.log(name, " with value ", value, " has been saved.");
    await dbset(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "has been deleted.");
    await del(name);
  },
};

export const defaultInitState: RecorderState = {
  inputDevice: (await storage.getItem("rec_dev_id")) || "",
  devOptions: [],
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
        startRecording: () => {},
        clearRecording: () => {},
      }),
      {
        name: "recorder-storage",
        storage: createJSONStorage(() => storage),
      }
    )
  );
};
