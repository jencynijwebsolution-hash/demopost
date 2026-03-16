import { Request, Response, NextFunction } from "express";
import Withdrawl from "../../models/WithdrawlModel";
import User from "../../models/UserModel";
import Wallet from "../../models/WalletModel";
import Transaction from "../../models/TransactionModel";
import { TRANSACTION_CONSTANT, TRANSACTION_REMARKS } from "../../constant/TransactionConstant";

export const createWithdrawal = async (req: Request, res: Response, next: NextFunction) => {
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


        if (openingBalance < Number(amount)) {
            return res.status(400).json({
                status: "fail",
                message: "Insufficient balance"
            });
        }

        const closingBalance = openingBalance - Number(amount);
        const withdraw = await Withdrawl.create({
            user_id,
            amount,
            payment_method,
            status,
            remark
        });


        let trxDeduct = TRANSACTION_CONSTANT.TRX_TYPE.DEDUCT;

        const transaction = await Transaction.create({
            user_id,
            type: "withdrawal",
            sign: trxDeduct.SIGN,
            amount,
            opening_balance: openingBalance,
            closing_balance: closingBalance,
            status: "success",
            remark: TRANSACTION_REMARKS.WITHDRAW
        });

        wallet.balance = closingBalance;
        await wallet.save();

        res.status(200).json({
            status: "success",
            message: "Withdrawal successfully",
            data: { withdraw, transaction }
        });

    } catch (error: any) {
        res.status(500).json({
            status: "fail",
            message: "Withdrawal failed",
            data: error.message
        })

    }
}


export const getAllWithrawal = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const withdraw = await Withdrawl.findAll({
            order: [["createdAt", "DESC"]]
        })

        res.status(200).json({
            status: "success",
            message: "User withdrawal history",
            data: withdraw
        });

    } catch (error: any) {
        res.status(500).json({
            status: "fail",
            message: "Withdrawal history failed",
            data: error.message
        })

    }
}