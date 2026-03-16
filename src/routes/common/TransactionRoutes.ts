import express from "express";
import { createTransaction } from "../../controller/common/TransactionController";


const router = express.Router();

router.post("/transaction", createTransaction);

export default router;