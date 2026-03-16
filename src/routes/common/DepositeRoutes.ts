import express from "express";
import { createDeposite, getAllDeposit } from "../../controller/common/DepositController";


const router = express.Router();

router.post("/deposit", createDeposite);
router.get("/getAll", getAllDeposit);

export default router;