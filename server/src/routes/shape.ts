import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import {
  createShape,
  deleteShapeById,
  updateShapeById,
} from "../controllers/shape";

const router = Router();

router.use(verifyToken);

router.post("/create", createShape);

router.put("/:id/edit", updateShapeById);

router.delete("/:id/remove", deleteShapeById);

export default router;
