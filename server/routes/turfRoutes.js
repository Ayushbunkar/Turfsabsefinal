import express from "express";
import multer from "multer";
import {
  createTurf,
  getAllTurfs,
  getMyTurfs,
  getTurfById,
  updateTurf,
  deleteTurf,
  approveTurf,
} from "../controllers/turfController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

import fs from "fs";
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

const router = express.Router();

// Public route
router.get("/", getAllTurfs);
router.get("/:id", getTurfById);

// Admin routes
router.post("/", protect, authorize("admin"), upload.single("image"), createTurf);
router.get("/my-turfs", protect, authorize("admin"), getMyTurfs);
router.put("/:id", protect, authorize("admin"), upload.single("image"), updateTurf);
router.delete("/:id", protect, authorize("admin"), deleteTurf);

// SuperAdmin route
router.put("/:id/approve", protect, authorize("superadmin"), approveTurf);

export default router;
