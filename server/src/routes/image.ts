import { Router } from "express";
import { updateImage } from "../controllers/image";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.put("/:documentId/edit", upload.single("file"), updateImage);

export default router;
