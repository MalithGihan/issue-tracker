import { Router } from "express";
import authRoutes from "../main/auth";
import issuesRoutes from "../main/issues";

const router = Router();

router.use("/auth", authRoutes);
router.use("/issues", issuesRoutes);

export default router;
