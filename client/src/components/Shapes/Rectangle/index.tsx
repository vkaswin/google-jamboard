import React from "react";

type RectangleProps = {
  width: number;
  height: number;
  borderColor: string;
  backgroundColor: string;
};

const Rectangle = ({
  width,
  height,
  borderColor,
  backgroundColor,
}: RectangleProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
    >
      <path
        d={`M0 0 L0 0 L0 ${height} L${width} ${height} L${width} 0 Z`}
        style={{ stroke: borderColor, fill: backgroundColor }}
      />
    </svg>
  );
};

export default Rectangle;
