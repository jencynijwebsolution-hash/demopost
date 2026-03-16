import express from "express";
import { createWallet, getWalletBalance } from "../../controller/common/WalletController";


const router = express.Router();

router.post("/wallet", createWallet);
router.get("/getAll/:id", getWalletBalance);

export default router;