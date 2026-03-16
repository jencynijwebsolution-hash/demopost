import express from "express";
import { getAllTransactions } from "../../controller/common/TransactionController";


const router = express.Router();

router.get("/transaction", getAllTransactions);

export default router;