"use client";

import { type WasmStore } from "@/stores/wasm-store";
import { WasmStoreContext } from "@/providers";
import { useContext } from "react";
import { useStore } from "zustand";

export const useWasmStore = <T>(selector: (store: WasmStore) => T): T => {
  const wasmStoreContext = useContext(WasmStoreContext);

  if (!wasmStoreContext) {
    throw new Error(`useWasmStore must be used within WasmStoreProvider`);
  }

  return useStore(wasmStoreContext, selector);
};
