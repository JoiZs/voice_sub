"use client";

import { useContext } from "react";
import { useStore } from "zustand";
import { RecorderStore } from "@/stores/recoder-store";
import { RecorderStoreContext } from "@/providers/recorder-provider";

export const useRecorderStore = <T>(
  selector: (store: RecorderStore) => T
): T => {
  const recorderStoreContext = useContext(RecorderStoreContext);

  if (!recorderStoreContext) {
    throw new Error(`useRecoderStore must be used within RecoderStoreProvider`);
  }

  return useStore(recorderStoreContext, selector);
};
