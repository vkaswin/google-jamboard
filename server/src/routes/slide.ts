import { Router } from "express";
import { clearSlide, createSlide, deleteSlide } from "../controllers/slide";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);

router.post("/:documentId/create", createSlide);

router.put("/:documentId/clear", clearSlide);

router.delete("/:documentId/remove", deleteSlide);

export default router;
