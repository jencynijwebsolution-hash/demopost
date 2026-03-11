import ApiFeatures from "../../utils/ApiFeatures";
import { Request, Response, NextFunction } from "express";
import User from "../../models/user/userModel";
import Logger from "../../logger";
import MailService from "../../utils/MailServices";
import { sendNotification } from "../../utils/helper";
import { NOTIFICATION_MODEL_CONSTANT, NOTIFICATION_TYPE_CONSTANT, USER_ROLE_CONSTANT } from "../../constant/notificationConstant";


export const userList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const features = new ApiFeatures(User, req.query)
            .paginate()
            .sort()
            .selectFields(['id', 'name'])
            .excludeFields(["password"])
            .rawResult()

        const result = await features.exec();

        res.status(200).json({ result });

    } catch (error: any) {

        res.status(500).json({ message: "Error fetching users" });
    }
};

export const status = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = req.body;
        const userId = Number(req.params.id);

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        if (!status) {
            return res.status(400).json({
                message: "status required"
            });
        }

        if (!["active", "deactive"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }

        if (user.status === status) {
            return res.status(400).json({
                message: `user is already ${status}`
            });
        }

        user.status = status;
        await user.save();


        await sendNotification({
            "message": `Your account is now ${status}`,
            "ids": [user.id],
            "notificationType": NOTIFICATION_TYPE_CONSTANT.USER_STATUS,
            "modelName": NOTIFICATION_MODEL_CONSTANT.USER,
            "modelId": user.id,
            "send_notification": true,
            "userType": USER_ROLE_CONSTANT.USER
        });

        res.status(200).json({
            success: true,
            message: `User ${status}`
        });

        setImmediate(async () => {
            try {
                const mailInstance = new MailService(user.email, user.name);
                await mailInstance.status(status);
            } catch (error: any) {
                Logger.error(`Status Mail Error: ${error?.message}`);
            }
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


