import { Placement } from "./Popper";
export interface DocumentDetail {
  _id: string;
  title: string;
  creatorId: string;
  slides: SlideDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentList {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface SlideDetail {
  _id: string;
  canvas: CanvasDetail;
  shapes: ShapeDetail[];
  props: SlideProps;
}

export interface SlideProps {
  backgroundImage: BackGroundCode;
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
  backgroundColor: Colors;
  borderColor: Colors;
  color?: Colors;
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

export type BackGroundCode =
  | "default"
  | "dots"
  | "blue-line"
  | "blue-graph"
  | "gray-graph"
  | "blue-board"
  | "chalk-board";

export type NewShapeType = {
  slideId: string;
  shape: {
    type: ShapeTypes;
    props: ShapeProps;
  };
};

export type Colors =
  | "#262626"
  | "#19ACC0"
  | "#699E3E"
  | "#FFFFFF"
  | "#F3B32A"
  | "#D9453C"
  | "#b1b3b4"
  | "#99dee6"
  | "#c3d9af"
  | "#fbe199"
  | "#f1b4af";

export type PageMeta = {
  page: number;
  total: number;
  totalPages: number;
};
