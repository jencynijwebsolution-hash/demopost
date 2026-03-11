import express from "express";
import { userList, status } from "../../controller/admin/AdminAuthController";
import { authenticate } from "../../middleware/AuthMiddleware";

const router = express.Router();

router.get("/getUser", authenticate, userList);
router.patch("/:id", status);

export default router;