import React from "react";

type CircleProps = {
  width: number;
  height: number;
  borderColor: string;
  backgroundColor: string;
};

const Circle = ({
  width,
  height,
  borderColor,
  backgroundColor,
}: CircleProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
    >
      <ellipse
        cx={width / 2}
        cy={height / 2}
        rx={width / 3}
        ry={height / 3}
        style={{ stroke: borderColor, fill: backgroundColor }}
      />
    </svg>
  );
};

export default Circle;
