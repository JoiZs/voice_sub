"use client";

import { type WasmStore } from "@/stores/wasm-store";
import { WasmStoreContext } from "@/providers/wasm-provider";
import { useContext } from "react";
import { useStore } from "zustand";
import { RecorderStore } from "@/stores/recoder-store";
import { RecorderStoreContext } from "@/providers/recorder-provider";

export const useWasmStore = <T>(selector: (store: WasmStore) => T): T => {
  const wasmStoreContext = useContext(WasmStoreContext);

  if (!wasmStoreContext) {
    throw new Error(`useWasmStore must be used within WasmStoreProvider`);
  }

  return useStore(wasmStoreContext, selector);
};

export const useRecorderStore = <T>(
  selector: (store: RecorderStore) => T
): T => {
  const recorderStoreContext = useContext(RecorderStoreContext);

  if (!recorderStoreContext) {
    throw new Error(`useRecoderStore must be used within RecoderStoreProvider`);
  }

  return useStore(recorderStoreContext, selector);
};
