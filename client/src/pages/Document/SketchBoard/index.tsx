import { useEffect, useRef } from "react";
import { getStaticUrl } from "@/utils";

import styles from "./SketchBoard.module.scss";

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

    if (tool === 0 || tool === 1) {
      canvasRef.current.addEventListener("pointerdown", handlePointerDown);
    } else {
      canvasRef.current.removeEventListener("pointerdown", handlePointerDown);
    }
    return () => {
      if (!canvasRef.current) return;
      canvasRef.current.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [tool]);

  useEffect(() => {
    drawImageInCanvas();
  }, [image]);

  useEffect(() => {
    if (!contextRef.current) return;

    let img = new Image();
    img.src = getStaticUrl(`/sketch-5.png`);
    img.onload = () => {
      let dot = contextRef.current!.createPattern(img, "repeat");
      if (!dot) return;
      contextRef.current!.fillStyle = dot;
      contextRef.current!.lineWidth = 2;
    };
  }, [sketch, contextRef.current]);

  useEffect(() => {
    if (!contextRef.current) return;
  }, [sketchColor, contextRef.current]);

  let handlePointerDown = ({ x, y }: MouseEvent) => {
    if (!canvasRef.current || !contextRef.current) return;
    let { left, top, width } = canvasRef.current.getBoundingClientRect();
    let num = dimension.width / width;

    canvasRef.current.addEventListener("pointermove", handlePointerMove);
    canvasRef.current.addEventListener("pointerup", handlePointerUp);
    contextRef.current.beginPath();
    contextRef.current.moveTo((x - left) * num, (y - top) * num);
  };

  let handlePointerMove = ({ x, y }: MouseEvent) => {
    if (!canvasRef.current || !contextRef.current) return;
    let { left, top, width } = canvasRef.current.getBoundingClientRect();
    let num = dimension.width / width;

    if (tool === 1) {
      contextRef.current.clearRect((x - left) * num, (y - top) * num, 20, 20);
    } else {
      contextRef.current.lineTo((x - left) * num, (y - top) * num);
      contextRef.current.stroke();
    }
  };

  let handlePointerUp = () => {
    if (!canvasRef.current) return;

    canvasRef.current.removeEventListener("pointermove", handlePointerMove);
    canvasRef.current.removeEventListener("pointerup", handlePointerUp);
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

  return (
    <canvas
      className={styles.sketch_board}
      ref={canvasRef}
      width={dimension.width}
      height={dimension.height}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default SketchBoard;
