import { z } from "zod";

export const ShapeSchema = z.object({
  documentId: z.string().optional(),
  type: z.string().optional(),
  props: z
    .object({
      width: z.number(),
      height: z.number(),
      translateX: z.number(),
      translateY: z.number(),
      rotate: z.number(),
    })
    .optional(),
});
