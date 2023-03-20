type Position = "top" | "bottom" | "right" | "left";
type Side = "start" | "end";

export type Placement = `${Position}-${Side}` | Position;
