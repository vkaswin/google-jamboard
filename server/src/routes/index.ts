import { Router } from "express";
import UserRoutes from "./user";
import DocumentRoutes from "./document";
import ImageRoutes from "./image";
import ShapeRoutes from "./shape";

const router = Router();

router.use("/api/user", UserRoutes);
router.use("/api/document", DocumentRoutes);
router.use("/api/shape", ShapeRoutes);
router.use("/api/image", ImageRoutes);

export default router;
