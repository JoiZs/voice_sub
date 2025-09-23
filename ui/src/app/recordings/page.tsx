"use client";

import DisplayRecording from "@/components/recording";
import { useRecorderStore } from "@/lib/use_store";
import Link from "next/link";
import React, { Suspense } from "react";

type Props = {};

const Recordings = (props: Props) => {
  const recordings = useRecorderStore((s) => s.currRecordedChunks);

  return (
    <div className="w-full h-full max-h-dvh max-w-lg m-auto text-sm grid grid-rows-9">
      <div className="row-span-1">
        <h1 className="text-xl font-semibold self-start py-4">
          {recordings.length} recordings found...
        </h1>
      </div>
      <div className="row-span-8">
        <div className="overflow-y-scroll h-full flex flex-col justify-start w-full gap-4">
          <Suspense fallback={<span>Loading data...</span>}>
            <DisplayRecording recording_idx={recordings} />
          </Suspense>
        </div>
      </div>
      <div className="w-full py-2 text-xs">
        <Link className="underline italic text-indigo-500" href={"/"}>
          Home
        </Link>
      </div>
    </div>
  );
};

export default Recordings;
