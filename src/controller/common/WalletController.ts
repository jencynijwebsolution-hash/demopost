import { Request, Response } from "express";
import Wallet from "../../models/WalletModel";
import User from "../../models/UserModel";

export const createWallet = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;

        const wallet = await Wallet.create({
            user_id,
            balance: 0
        });

        res.status(200).json({
            status: "success",
            message: "Wallet Created",
            data: wallet
        });
    } catch (error: any) {
        res.status(500).json({
            status: "fail",
            message: "Wallet creation Failed",
            data: error.message
        })
    }
}

export const getWalletBalance = async (req: Request, res: Response) => {
    try {
        const user_id = req.params.id;

        const wallet = await Wallet.findOne({
            where: { user_id }
        });

        if (!wallet) {
            return res.status(404).json({
                status: "fail",
                message: "wallet not found"
            })
        }
        res.status(200).json({
            status: "success",
            balance: wallet.balance
        })
    } catch (error: any) {
        res.status(500).json({
            status: "fail",
            message: "Error fetching wallet",
            data: error.message
        });
    }
}