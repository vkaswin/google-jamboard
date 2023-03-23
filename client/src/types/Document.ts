export interface DocumentDetail {
  _id: string;
  creatorId: string;
  image: string;
  title: string;
  shapes: ShapeDetail[];
}

export type ShapeTypes =
  | "arrow"
  | "circle"
  | "diamond"
  | "rectangle"
  | "semi-circle"
  | "square"
  | "triangle";

export interface ShapeProps {
  width: number;
  height: number;
  translateX: number;
  translateY: number;
  rotate: number;
}

export interface ShapeDetail {
  _id: string;
  type: ShapeTypes;
  props: ShapeProps;
}