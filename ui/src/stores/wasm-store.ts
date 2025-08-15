import { WasmMemoryInterface, runWasm } from "@/lib/wasm_runtime";
import { Ref } from "react";
import { createStore } from "zustand";

export type WasmState = {
  memory: WasmMemoryInterface | undefined;
};

export type WasmActions = {
  init: (wasmPath: string, consoleEle: Ref<HTMLPreElement>) => void;
};

export type WasmStore = WasmState & WasmActions;

export const defaultInitState: WasmState = {
  memory: undefined,
};

export const createWasmStore = (initState: WasmState = defaultInitState) => {
  return createStore<WasmStore>()((set, get) => ({
    ...initState,
    init: async (wasmPath: string, consoleEle: Ref<HTMLPreElement>) => {
      let mem: WasmMemoryInterface = get().memory || new WasmMemoryInterface();
      console.log("Initialized Memory...");

      await runWasm(wasmPath, consoleEle, undefined, mem);

      if (!get().memory) set(() => ({ memory: mem }));
    },
  }));
};
