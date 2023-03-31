import { Router } from "express";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getDocument,
  updateDocument,
} from "../controllers/document";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);

router.post("/create", createDocument);

router.put("/:documentId/edit", updateDocument);

router.get("/list", getAllDocuments);

router.get("/:documentId/detail", getDocument);

router.delete("/:documentId/remove", deleteDocument);

export default router;
