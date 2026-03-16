import { Request, Response, NextFunction } from "express";
import User from "../../models/UserModel";
import Transaction from "../../models/TransactionModel";
import Wallet from "../../models/WalletModel";

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { user_id, type, amount, remark } = req.body;

        if (!user_id) {
            return res.status(400).json({
                status: "fail",
                message: "user_id is required"
            });
        }

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        const wallet = await Wallet.findOne({ where: { user_id } });

        if (!wallet) {
            return res.status(404).json({
                status: "fail",
                message: "wallet not found"
            })
        }

        const openingBalance = Number(wallet.balance);
        let closingBalance = openingBalance;

        if (type === "deposit") {
            closingBalance = openingBalance + Number(amount);
        }
        if (type === "withdrawal") {
            if (openingBalance < Number(amount)) {
                return res.status(400).json({
                    status: "fail",
                    message: "Insufficient Balance"
                });
            }

            closingBalance = openingBalance - Number(amount);
        }

        const transactions = await Transaction.create({
            user_id,
            type,
            amount,
            opening_balance: openingBalance,
            closing_balance: closingBalance,
            status: "success",
            remark
        });

        res.status(200).json({
            status: "success",
            message: "Transaction successfully",
            data: transactions
        });

    } catch (error: any) {
        res.status(500).json({
            status: "fail",
            message: "Transaction failed",
            data: error.message
        })

    }
}
