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
  isActiveSlide: boolean;
  onUpdateCanvas: (canvasId: string, blob: Blob) => void;
};

const SketchBoard = ({
  tool,
  sketch,
  sketchColor,
  canvas,
  dimension,
  isActiveSlide = false,
  onUpdateCanvas,
}: SketchBoardProps) => {
  let canvasRef = useRef<HTMLCanvasElement | null>(null);

  let contextRef = useRef<CanvasRenderingContext2D | null>(null);

  let miniContextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvas.image) return;
    drawImageInCanvas();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext("2d");
    let miniCanvas = document.querySelector<HTMLCanvasElement>(
      `[mini-canvas='${canvas._id}']`
    );
    if (!miniCanvas) return;
    miniContextRef.current = miniCanvas.getContext("2d");
  }, []);

  useEffect(() => {
    contextRef.current!.strokeStyle =
      tool === 6 ? "#FF3131" : colors[sketchColor].colorCode;
    contextRef.current!.lineWidth = 5;
    contextRef.current!.lineCap = "round";
    contextRef.current!.lineJoin = "round";
  }, [sketchColor, tool]);

  let handleMouseDown = ({ pageX, pageY }: React.MouseEvent) => {
    if (!canvasRef.current || !contextRef.current) return;
    let { left, top, width, height } =
      canvasRef.current.getBoundingClientRect();
    let scaleX = dimension.width / width;
    let scaleY = dimension.height / height;

    let x = (pageX - left) * scaleX;
    let y = (pageY - top) * scaleY;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);

    if (miniContextRef.current) {
      miniContextRef.current.beginPath();
      miniContextRef.current.moveTo(x, y);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, {
      once: true,
    });
  };

  let handleMouseMove = ({ x: pageX, y: pageY }: MouseEvent) => {
    if (!canvasRef.current || !contextRef.current) return;

    let { left, top, width, height } =
      canvasRef.current.getBoundingClientRect();
    let scaleX = dimension.width / width;
    let scaleY = dimension.height / height;

    let x = (pageX - left) * scaleX;
    let y = (pageY - top) * scaleY;

    if (tool === 0 || tool == 6) {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();

      if (miniContextRef.current) {
        miniContextRef.current.lineTo(x, y);
        miniContextRef.current.stroke();
      }
    } else if (tool === 1) {
      contextRef.current.clearRect(x, y, 20, 20);
      if (miniContextRef.current) {
        miniContextRef.current.clearRect(x, y, 20, 20);
      }
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
    let image = new Image();
    image.src = `data:image/png;base64,${canvas.image}`;
    image.onload = () => {
      if (!contextRef.current) return;
      contextRef.current.drawImage(image, 0, 0);
      if (miniContextRef.current) {
        miniContextRef.current.drawImage(image, 0, 0);
      }
    };
  };

  let handleContextMenu = (event: React.MouseEvent) => {
    if ([0, 1, 6].includes(tool)) event.preventDefault();
  };

  return (
    <canvas
      ref={canvasRef}
      className={styles.sketch_board}
      width={dimension.width}
      height={dimension.height}
      data-canvas={canvas._id}
      style={{ pointerEvents: [0, 1, 6].includes(tool) ? "auto" : "none" }}
      onContextMenu={handleContextMenu}
      {...([0, 1, 6].includes(tool) &&
        isActiveSlide && { onMouseDown: handleMouseDown })}
    />
  );
};

export default SketchBoard;
