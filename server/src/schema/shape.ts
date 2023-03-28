import { z } from "zod";

export const ShapeSchema = z.object({
  type: z.string(),
  props: z.object({
    width: z.number(),
    height: z.number(),
    translateX: z.number(),
    translateY: z.number(),
    rotate: z.number(),
    backgroundColor: z.string().optional(),
    text: z.string().optional(),
  }),
});
