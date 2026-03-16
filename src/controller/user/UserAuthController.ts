import { Request, Response, NextFunction } from "express";
import User from "../../models/UserModel";
import MailService from "../../utils/MailServices";
import Logger from "../../logger";
import bcrypt from "bcrypt";
import ApiError from "../../utils/ApiError";
import { userLoginToken } from "../common/UserTokenController";
import { CustomRequest, sendNotification } from "../../utils/Helper";
import { NOTIFICATION_MODEL_CONSTANT, NOTIFICATION_TYPE_CONSTANT, USER_ROLE_CONSTANT } from "../../constant/NotificationConstant";
import catchAsync from "../../utils/CatchAsync";

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ where: { email } })
        if (userExist) {
            return res.status(409).json({ message: "user already exist" });
        }

        const user = await User.create({
            name,
            email,
            password,
            status: "pending"
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        res.status(200).json({
            status: "success",
            message: "user singup successfully. OTP sent to your mail",
            data: user
        });

        setImmediate(async () => {
            try {
                const mailInstance = new MailService(user.email, user.name);
                await mailInstance.otp(otp);
            } catch (error: any) {
                Logger.error(`OTP Mail Error: ${error?.message}`);
            }
        });
        
    } catch (error: any) {
        res.status(500).json({
            status: "fail",
            message: "signup failed",
            data: error.message
        })

    }
}

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email }, attributes: { include: ["password"] } });

        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new ApiError("invalid password", 401));
        }

        const token = userLoginToken(String(user.id));

        const days = Number(process.env.COOKIE_EXPIRES_IN) || 7;

        res.cookie("token", token, {
            expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.status(200).json({
            data: user,
            token
        });

    } catch (error: any) {
        res.status(500).json({
            message: "login failed",
            data: error.message
        })
    }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        const user = await User.findByPk(id, {
            attributes: { exclude: ["password", "otp", "otpExpiry"] }
        });

        if (!user) {
            res.status(400).json({
                message: "user not found"
            })
        }

        res.status(200).json({
            status: "success",
            data: user
        });

    } catch (error: any) {
        res.status(500).json({
            message: "Error fetching user",
            error: error.message
        });
    }
};

export const verifyOtp = catchAsync(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return next(new ApiError("Email and OTP required", 400));
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return next(new ApiError("User not found", 400));
        }

        if (user.otp !== otp) {
            return next(new ApiError("Invalid OTP", 400));
        }

        if (!user.otpExpiry || new Date() > user.otpExpiry) {
            return next(new ApiError("OTP expired.please resend otp", 400));
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        await sendNotification({
            "message": `${user.name} signup`,
            "ids": [1],
            "notificationType": NOTIFICATION_TYPE_CONSTANT.PROFILE_VERIFICATION,
            "modelName": NOTIFICATION_MODEL_CONSTANT.USER,
            "modelId": user.id,
            "send_notification": true,
            "userType": USER_ROLE_CONSTANT.ADMIN,
        });

        res.status(200).json({
            status: "success",
            message: "Account verified successfully",
        });
    }
);

export const resendOtp = async (req: CustomRequest, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(409).json({
                message: "User already verified"
            });
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = newOtp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        const mailService = new MailService(user.email, user.name);
        await mailService.otp(newOtp);

        await sendNotification({
            message: `Your OTP code is: ${newOtp}`, 
            ids: [user.id],                         
            userType: USER_ROLE_CONSTANT.USER,      
            notificationType: "OTP",                
            send_notification: true                 
        });

        res.status(200).json({
            status: "success",
            message: "New OTP sent successfully"
        });

    } catch (error: any) {
        res.status(500).json({
            message: "Resend OTP failed",
            error: error.message
        });
    }
};