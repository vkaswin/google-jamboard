import React from "react";

type SquareProps = {
  width: number;
  height: number;
};

const Square = ({ width, height }: SquareProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
    >
      <path d={`M0 0 L0 0 L0 ${height} L${width} ${height} L${width} 0 Z`} />
    </svg>
  );
};

export default Square;
