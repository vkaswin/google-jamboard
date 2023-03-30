import { Placement } from "./Popper";
export interface DocumentDetail {
  _id: string;
  title: string;
  creatorId: string;
  slides: SlideDetail[];
}

export interface SlideDetail {
  _id: string;
  canvas: CanvasDetail;
  shapes: ShapeDetail[];
}

export interface CanvasDetail {
  _id: string;
  image: string | null;
}

export type ShapeTypes =
  | "arrow"
  | "circle"
  | "diamond"
  | "rectangle"
  | "semi-circle"
  | "square"
  | "triangle"
  | "sticky-note"
  | "text-box";

export interface ShapeProps {
  width: number;
  height: number;
  translateX: number;
  translateY: number;
  rotate: number;
  backgroundColor?: string;
  color?: string;
  text?: string;
}

export interface ShapeDetail {
  _id: string;
  type: ShapeTypes;
  props: ShapeProps;
}

export type ResizeType = Placement | "rotate" | "move";

export type MouseDownEvent = {
  type: ResizeType;
  pageX: number;
  pageY: number;
};
