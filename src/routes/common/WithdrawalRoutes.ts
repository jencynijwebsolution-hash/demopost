import express from "express";
import { createWithdrawal, getAllWithrawal} from "../../controller/common/WithdrawalController";


const router = express.Router();

router.post("/create", createWithdrawal);
router.get("/getAll", getAllWithrawal);


export default router;