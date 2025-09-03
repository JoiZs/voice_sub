import { useRecorderStore } from "@/lib/use_store";
import React, { useEffect, useRef } from "react";

type Props = {};

const Display = (props: Props) => {
  const freqData = useRecorderStore((s) => s.freqData);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!freqData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) {
      alert("Not found canvas 2D context...");
      return;
    }

    let frameId: number;

    const draw = () => {
      if (!freqData || !canvasRef.current) return;
      const canvasCtx = canvasRef.current.getContext("2d");
      if (!canvasCtx) return;

      const width = canvas.width;
      const height = canvas.height;

      canvasCtx.clearRect(0, 0, width, height);
      canvasCtx.fillStyle = "rgb(255, 255, 255)";
      canvasCtx.fillRect(0, 0, width, height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(0, 0, 0)";
      canvasCtx.beginPath();

      const bufferLength = freqData.length;

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      const maxVal = Math.max(...freqData) || 1;

      for (let i = 0; i < bufferLength; i++) {
        // Normalize freqData[i] from 0-255 to 0-1 range then invert y for canvas

        const v = freqData[i] / maxVal;
        const y = height - v * height; // y = bottom to top

        barHeight = y / 2;

        canvasCtx.fillStyle = `rgb(${barHeight + 100} 50 50)`;
        canvasCtx.fillRect(x, height - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }

      canvasCtx.stroke();

      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(frameId);
  }, [freqData]);

  return <canvas ref={canvasRef} />;
};

export default Display;
