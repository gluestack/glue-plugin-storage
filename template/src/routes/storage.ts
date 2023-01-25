import { Router } from "express";
const multer = require("multer");

// Others
import Controller from "../controllers/storage/handlers";

const router = Router();

/**
 * Authentication routes
 */
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 Mb
 },
});

router.post("/upload", upload.single("file"), Controller.upload);
router.get("/get/:id", Controller.get);

export default router;
