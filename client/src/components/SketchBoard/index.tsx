import React, { useEffect, useRef } from "react";
import { colors } from "@/constants";
import { CanvasDetail } from "@/types/Document";

import styles from "./SketchBoard.module.scss";

type SketchBoardProps = {
  tool: number;
  sketch: number;
  sketchColor: number;
  canvas: CanvasDetail;
  dimension: { width: number; height: number };
  onUpdateCanvas: (canvasId: string, blob: Blob) => void;
};

const SketchBoard = ({
  tool,
  sketch,
  sketchColor,
  canvas,
  dimension,
  onUpdateCanvas,
}: SketchBoardProps) => {
  let canvasRef = useRef<HTMLCanvasElement | null>(null);

  let contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext("2d");
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    if ([0, 1, 6].includes(tool)) {
      canvasRef.current.addEventListener("mousedown", handleMouseDown);
    } else {
      canvasRef.current.removeEventListener("mousedown", handleMouseDown);
    }
    return () => {
      if (!canvasRef.current) return;
      canvasRef.current.removeEventListener("mousedown", handleMouseDown);
    };
  }, [tool]);

  useEffect(() => {
    if (!canvas.image) return;
    drawImageInCanvas();
  }, [canvas.image]);

  useEffect(() => {
    contextRef.current!.strokeStyle =
      tool === 6 ? "#FF3131" : colors[sketchColor].colorCode;
    contextRef.current!.lineWidth = 5;
    contextRef.current!.lineCap = "round";
    contextRef.current!.lineJoin = "round";
  }, [sketchColor, tool]);

  let handleMouseDown = ({ x, y }: MouseEvent) => {
    if (!canvasRef.current || !contextRef.current) return;
    let { left, top, width, height } =
      canvasRef.current.getBoundingClientRect();
    let scaleX = dimension.width / width;
    let scaleY = dimension.height / height;

    x = (x - left) * scaleX;
    y = (y - top) * scaleY;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, {
      once: true,
    });
  };

  let handleMouseMove = ({ x, y }: MouseEvent) => {
    if (!canvasRef.current || !contextRef.current) return;
    let { left, top, width, height } =
      canvasRef.current.getBoundingClientRect();
    let scaleX = dimension.width / width;
    let scaleY = dimension.height / height;

    x = (x - left) * scaleX;
    y = (y - top) * scaleY;

    if (tool === 0 || tool == 6) {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    } else if (tool === 1) {
      contextRef.current.clearRect(x, y, 20, 20);
    }
  };

  let handleMouseUp = () => {
    if (!canvasRef.current) return;

    window.removeEventListener("mousemove", handleMouseMove);
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      onUpdateCanvas(canvas._id, blob);
    }, "image/png");
  };

  let drawImageInCanvas = () => {
    if (!canvasRef.current || !contextRef.current || !canvas.image) return;

    let image = new Image();
    image.src = `data:image/png;base64,${canvas.image}`;
    image.onload = () => {
      contextRef.current!.drawImage(image, 0, 0);
    };
  };

  let handleContextMenu = (event: React.MouseEvent) => {
    if ([0, 1, 6].includes(tool)) event.preventDefault();
  };

  return (
    <canvas
      className={styles.sketch_board}
      ref={canvasRef}
      width={dimension.width}
      height={dimension.height}
      style={{ pointerEvents: [0, 1, 6].includes(tool) ? "auto" : "none" }}
      onContextMenu={handleContextMenu}
    />
  );
};

export default SketchBoard;
