import { Router } from "express";
import { updateCanvas } from "../controllers/canvas";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.put("/:canvasId/edit", upload.single("file"), updateCanvas);

export default router;
