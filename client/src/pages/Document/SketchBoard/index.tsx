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

    if (tool === 0 || tool === 1 || tool === 7) {
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

  let handleMouseDown = ({ x, y }: MouseEvent) => {
    if (!canvasRef.current || !contextRef.current) return;
    let { left, top, width } = canvasRef.current.getBoundingClientRect();
    let num = dimension.width / width;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, {
      once: true,
    });
    contextRef.current.beginPath();
    contextRef.current.moveTo((x - left) * num, (y - top) * num);
  };

  let handleMouseMove = ({ x, y }: MouseEvent) => {
    if (!canvasRef.current || !contextRef.current) return;
    let { left, top, width } = canvasRef.current.getBoundingClientRect();
    let num = dimension.width / width;
    x = (x - left) * num;
    y = (y - top) * num;

    if (tool === 0 || tool == 7) {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
      // Laser
      if (tool === 7) {
        setTimeout(() => {
          if (!contextRef.current) return;
          contextRef.current.clearRect(x, y, 2, 2);
        }, 1000);
      }
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

  return (
    <canvas
      className={styles.sketch_board}
      ref={canvasRef}
      width={dimension.width}
      height={dimension.height}
      style={{ pointerEvents: [0, 1, 7].includes(tool) ? "auto" : "none" }}
    />
  );
};

export default SketchBoard;
