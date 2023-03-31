import React from "react";

type DiamondProps = {
  width: number;
  height: number;
  borderColor: string;
  backgroundColor: string;
};

const Diamond = ({
  width,
  height,
  borderColor,
  backgroundColor,
}: DiamondProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
    >
      <path
        d={`M${width / 2} ${height} L${width / 2} ${height} L0 ${height / 2} L${
          width / 2
        } 0 L${width} ${height / 2} Z`}
        style={{ stroke: borderColor, fill: backgroundColor }}
      />
    </svg>
  );
};

export default Diamond;
