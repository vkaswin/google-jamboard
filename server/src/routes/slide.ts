import { Router } from "express";
import { createSlide, deleteSlide } from "../controllers/slide";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);

router.post("/:documentId/create", createSlide);

router.delete("/:documentId/remove", deleteSlide);

export default router;
