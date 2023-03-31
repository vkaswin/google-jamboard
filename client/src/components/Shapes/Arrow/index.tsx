import React from "react";

type ArrowProps = {
  width: number;
  height: number;
  borderColor: string;
  backgroundColor: string;
};

const Arrow = ({ width, height, borderColor, backgroundColor }: ArrowProps) => {
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
        style={{ stroke: borderColor, fill: backgroundColor }}
      />
    </svg>
  );
};

export default Arrow;
