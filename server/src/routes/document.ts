import { Router } from "express";
import {
  createDocument,
  deleteDocument,
  getDocument,
  updateDocument,
} from "../controllers/document";

const router = Router();

router.post("/create", createDocument);

router.put("/:documentId/edit", updateDocument);

router.get("/:documentId/detail", getDocument);

router.delete("/:documentId/remove", deleteDocument);

export default router;
