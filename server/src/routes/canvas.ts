import { Router } from "express";
import multer from "multer";
import { updateCanvas } from "../controllers/canvas";
import verifyToken from "../middlewares/verifyToken";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.use(verifyToken);

router.put("/:canvasId/edit", upload.single("file"), updateCanvas);

export default router;
