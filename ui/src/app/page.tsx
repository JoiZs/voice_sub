"use client";

import Display from "@/components/display";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { AudioFileInfo } from "@/generated/rpc/service_pb";
import { createClient } from "@/utils/rpc_client";
import { useEffect } from "react";

export default function Home() {
  // useEffect(() => {
  //   const client = createClient();

  //   const request = new AudioFileInfo();
  //   const tempList = new Uint8Array(10);
  //   tempList.fill(6);

  //   request.setAudioBuff(tempList);

  //   client.sendAudio(request, {}, (err, res) => {
  //     console.log(res, err);
  //   });
  // }, []);

  return (
    <div className="w-full h-full max-w-lg m-auto flex justify-center items-center flex-col">
      <Nav />
      <Display />
      <Footer />
    </div>
  );
}
