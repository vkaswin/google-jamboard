import React, { useEffect, useRef } from "react";

import styles from "./SketchBoard.module.scss";
import { colors } from "@/constants";

type SketchBoardProps = {
  tool: number;
  sketch: number;
  sketchColor: number;
  image: string;
  documentId?: string;
  dimension: { width: number; height: number };
  onUpdateImage: (blob: Blob) => void;
};

const SketchBoard = ({
  tool,
  sketch,
  sketchColor,
  image,
  documentId,
  dimension,
  onUpdateImage,
}: SketchBoardProps) => {
  let canvasRef = useRef<HTMLCanvasElement | null>(null);

  let contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext("2d");
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (tool === 0 || tool === 1 || tool === 6) {
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
    if (!image) return;
    drawImageInCanvas();
  }, [image]);

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

      //   if (tool === 6) {
      //     setTimeout(() => {
      //       if (!contextRef.current) return;
      //       contextRef.current.clearRect(x, y, 5, 5);
      //     }, 1000);
      //   }
    } else if (tool === 1) {
      contextRef.current.clearRect(x, y, 20, 20);
    }
  };

  let handleMouseUp = () => {
    if (!canvasRef.current) return;

    window.removeEventListener("mousemove", handleMouseMove);
    canvasRef.current.toBlob(handleCanvasImage, "image/png");
  };

  let handleCanvasImage = async (blob: Blob | null) => {
    if (!blob) return;
    onUpdateImage(blob);
  };

  let drawImageInCanvas = () => {
    if (!canvasRef.current || !contextRef.current) return;

    let img = new Image();
    img.src = image;
    img.onload = () => {
      contextRef.current!.drawImage(img, 0, 0);
    };
  };

  let handleContextMenu = (event: React.MouseEvent) => {
    if (tool === 0 || tool === 1 || tool === 6) event.preventDefault();
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
