import { Router } from "express";
import {
  clearSlide,
  createSlide,
  deleteSlide,
  updateSlide,
} from "../controllers/slide";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);

router.post("/:documentId/create", createSlide);

router.put("/:documentId/clear", clearSlide);

router.put("/:documentId/edit", updateSlide);

router.delete("/:documentId/remove", deleteSlide);

export default router;
