import React from "react";

type ArrowProps = {
  width: number;
  height: number;
};

const Arrow = ({ width, height }: ArrowProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
    >
      <path
        d={`M${width} ${height / 2} L${width} ${height / 2} L${width / 2} 0 L${
          width / 2
        } ${height / 6} L0 ${height / 6} L0 ${height - height / 6} L${
          width / 2
        } ${height - height / 6} L${width / 2} ${height} Z`}
      />
    </svg>
  );
};

export default Arrow;
