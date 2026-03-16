import Router from "express";
import { getUserById, resendOtp, userLogin, userSignup, verifyOtp } from "../../controller/user/UserAuthController";
import { authenticate } from "../../middleware/AuthMiddleware";
import { registerSchema } from "../../validators/UserValidator";
import { validate } from "../../middleware/ValidateMiddleware";
const router = Router();

router.post("/", validate(registerSchema), userSignup);
router.post("/login", userLogin);
router.get("/getOne/:id", authenticate, getUserById);
router.post("/resendOTP", resendOtp);
router.post("/verifyOTP", verifyOtp);

export default router;