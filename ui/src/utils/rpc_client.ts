import { AudioSTTServiceClient } from "@/generated/rpc/ServiceServiceClientPb";

export const createClient = () => {
  return new AudioSTTServiceClient("http://localhost:8080");
};
