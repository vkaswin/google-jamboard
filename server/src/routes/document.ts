import { Router } from "express";
import {
  clearDocument,
  createDocument,
  getDocument,
} from "../controllers/document";

const router = Router();

router.post("/create", createDocument);

router.put("/:documentId/clear", clearDocument);

router.get("/:documentId/detail", getDocument);

export default router;
