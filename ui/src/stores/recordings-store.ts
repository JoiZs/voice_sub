"use client";

import { set, get, createStore } from "idb-keyval";
import { v4 as uuidv4 } from "uuid";

const recStore = createStore("rec_db_2", "rec_store");

export const SetRecording = async (data: Blob) => {
  const key = uuidv4();

  await set(key, data, recStore);
  return key;
};

export const GetRecording = async (key: string) => {
  return await get(key, recStore);
};
