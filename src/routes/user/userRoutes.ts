import Router from "express";
import { getUserById, resendOtp, userLogin, userSignup, verifyOtp } from "../../controller/user/UserAuthController";
import { authenticate } from "../../middleware/authMiddleware";
import { registerSchema } from "../../validators/userValidator";
import { validate } from "../../middleware/validateMiddleware";
const router = Router();

router.post("/", validate(registerSchema), userSignup);
router.post("/login", userLogin);
router.get("/getOne/:id", authenticate, getUserById);
router.post("/resendOTP", resendOtp)
router.get("/verifyOTP", verifyOtp)

export default router;