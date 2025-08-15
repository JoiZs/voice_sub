"use client";

import { type ReactNode, createContext, useRef } from "react";

import { createWasmStore } from "@/stores/wasm-store";

export type WasmStoreApi = ReturnType<typeof createWasmStore>;

export const WasmStoreContext = createContext<WasmStoreApi | undefined>(
  undefined
);

export interface WasmStoreProviderProps {
  children: ReactNode;
}

export const WasmStoreProvider = ({ children }: WasmStoreProviderProps) => {
  const storeRef = useRef<WasmStoreApi | null>(null);
  if (storeRef.current == null) {
    storeRef.current = createWasmStore();
  }

  return (
    <WasmStoreContext.Provider value={storeRef.current}>
      {children}
    </WasmStoreContext.Provider>
  );
};
