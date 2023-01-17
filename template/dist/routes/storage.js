"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require("multer");
// Others
const handlers_1 = __importDefault(require("../controllers/storage/handlers"));
const router = (0, express_1.Router)();
/**
 * Authentication routes
 */
const upload = multer({
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 Mb
    },
});
router.post("/upload", upload.single("file"), handlers_1.default.upload);
router.get("/get/:id", handlers_1.default.get);
// router.get("/file/:path", Controller.file); //deprecated api
exports.default = router;
