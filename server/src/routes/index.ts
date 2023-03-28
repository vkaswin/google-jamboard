import { Router } from "express";
import UserRoutes from "./user";
import DocumentRoutes from "./document";
import CanvasRoutes from "./canvas";
import ShapeRoutes from "./shape";
import SlideRoutes from "./slide";

const router = Router();

router.use("/api/user", UserRoutes);
router.use("/api/document", DocumentRoutes);
router.use("/api/shape", ShapeRoutes);
router.use("/api/canvas", CanvasRoutes);
router.use("/api/slide", SlideRoutes);

export default router;
