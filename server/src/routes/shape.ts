import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import { createShape, deleteShape, updateShape } from "../controllers/shape";

const router = Router();

router.use(verifyToken);

router.post("/:documentId/create", createShape);

router.put("/:shapeId/edit", updateShape);

router.delete("/:documentId/remove", deleteShape);

export default router;
