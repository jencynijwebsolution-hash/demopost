import express from "express";
import { createDeposite, getAllDeposit } from "../../controller/common/DepositController";
import { depositSchema } from "../../validators/DepositeValidator";
import { validate } from "../../middleware/ValidateMiddleware";

const router = express.Router();

router.post("/deposit", validate(depositSchema), createDeposite);
router.get("/getAll", getAllDeposit);

export default router;