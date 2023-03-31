import React from "react";

type TriangleProps = {
  width: number;
  height: number;
  borderColor: string;
  backgroundColor: string;
};

const Triangle = ({
  width,
  height,
  borderColor,
  backgroundColor,
}: TriangleProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
    >
      <path
        d={`M${width} ${height} L${width} ${height} L0 ${height} L${
          width / 2
        } 0 Z`}
        style={{ stroke: borderColor, fill: backgroundColor }}
      />
    </svg>
  );
};

export default Triangle;
