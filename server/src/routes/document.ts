import { Router } from "express";
import { createDocument, getDocument } from "../controllers/document";

const router = Router();

router.post("/create", createDocument);

router.get("/:id/detail", getDocument);

export default router;
