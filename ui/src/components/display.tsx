import { useWasmStore } from "@/lib/use_store";
import React, { useEffect } from "react";

type Props = {};

const Display = (props: Props) => {
  const wasmMem = useWasmStore((s) => s.memory);

  useEffect(() => {
    if (wasmMem) {
      wasmMem.exports.allc_data_size(64);

      console.log("len: ", wasmMem.exports.allc_data_len());
    }
  }, [wasmMem]);

  return <canvas id="drawingCanvas" className="bg-teal-50" />;
};

export default Display;
