import { Router } from "express";
import {
  createDocument,
  deleteDocument,
  getDocument,
} from "../controllers/document";

const router = Router();

router.post("/create", createDocument);

router.get("/:documentId/detail", getDocument);

router.delete("/:documentId/remove", deleteDocument);

export default router;
