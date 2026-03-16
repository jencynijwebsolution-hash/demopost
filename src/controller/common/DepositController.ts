import { Request, Response, NextFunction } from "express";
import Deposit from "../../models/DepositModel";
import User from "../../models/UserModel";
import { any } from "joi";
import Transaction from "../../models/TransactionModel";
import Wallet from "../../models/WalletModel";

export const createDeposite = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { user_id, amount, payment_method, status, remark } = req.body;

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
                message: "Wallet not found"
            });
        }
        const openingBalance = Number(wallet.balance);
        const closingBalance = openingBalance + Number(amount);

        // Update wallet balance
        wallet.balance = closingBalance;
        await wallet.save();

        const deposit = await Deposit.create({
            user_id,
            amount,
            payment_method,
            status,
            remark
        });

        const transaction = await Transaction.create({
            user_id,
            type: "deposit",
            amount,
            opening_balance: openingBalance,
            closing_balance: closingBalance,
            status: "success",
            remark
        });

        res.status(200).json({
            status: "success",
            message: "Deposit successfully",
            data: { deposit, transaction }
        });

    } catch (error: any) {
        res.status(500).json({
            status: "fail",
            message: "Deposit failed",
            data: error.message
        })

    }
}

export const getAllDeposit = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const deposits = await Deposit.findAll({
            order: [["createdAt", "DESC"]]
        })

        res.status(200).json({
            status: "success",
            message: "User deposit history",
            data: deposits
        });

    } catch (error: any) {
        res.status(500).json({
            status: "fail",
            message: "Deposit history failed",
            data: error.message
        })

    }
}



