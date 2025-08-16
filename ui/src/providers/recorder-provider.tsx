"use client";

import { type ReactNode, createContext, useRef } from "react";

import { createRecorderStore } from "@/stores/recoder-store";

export type RecorderStoreApi = ReturnType<typeof createRecorderStore>;

export const RecorderStoreContext = createContext<RecorderStoreApi | undefined>(
  undefined
);

export interface RecoderStoreProviderProps {
  children: ReactNode;
}

export const RecorderStoreProvider = ({
  children,
}: RecoderStoreProviderProps) => {
  const storeRef = useRef<RecorderStoreApi | null>(null);

  if (storeRef.current == null) {
    storeRef.current = createRecorderStore();
  }

  return (
    <RecorderStoreContext.Provider value={storeRef.current}>
      {children}
    </RecorderStoreContext.Provider>
  );
};
