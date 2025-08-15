"use client";

import Display from "@/components/display";
import { useWasmStore } from "@/lib/use_store";
import { useEffect, useRef } from "react";

export default function Home() {
  const consoleRef = useRef<HTMLPreElement>(null);
  const { init } = useWasmStore((state) => state);

  useEffect(() => {
    const initWasm = () => {
      init("main.wasm", consoleRef);
    };

    initWasm();
    return;
  }, []);

  return (
    <div className="w-full h-full max-w-lg m-auto">
      <pre ref={consoleRef} />
      <Display />
    </div>
  );
}
