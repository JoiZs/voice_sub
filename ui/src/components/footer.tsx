import { useRecorderStore } from "@/lib/use_store";
import React from "react";
import Link from "next/link";

type Props = {};

const Footer = (props: Props) => {
  const recordings = useRecorderStore((s) => s.currRecordedChunks);

  return (
    <div className="text-xs flex flex-row justify-between w-full p-4">
      <Link
        href={"/recordings"}
        className="underline cursor-pointer italic text-indigo-600"
      >
        Total Recordings:{" "}
      </Link>
      <span className="font-semibold italic">{recordings.length}</span>
    </div>
  );
};

export default Footer;
