import { Request, Response, NextFunction } from "express";
import User from "../../models/UserModel";
import Transaction from "../../models/TransactionModel";
import Wallet from "../../models/WalletModel";

export const getAllTransactions = async (req: Request, res: Response) => {
  try {

    const transactions = await Transaction.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
      status: "success",
      message: "Transaction history",
      data: transactions
    });

  } catch (error:any) {

    res.status(500).json({
      status: "fail",
      message: "Transaction fetch failed",
      data: error.message
    });

  }
};
