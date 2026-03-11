import { Request } from "express";
import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken"
import AdminNotification from "../models/admin/AdminNotificationModel";
import UserNotification from "../models/user/UserNotificationModel"
import Logger from "../logger";
import { getIo } from "../socket"
import { Model, ModelStatic } from "sequelize";
import { USER_ROLE_CONSTANT } from "../constant/NotificationConstant";

export interface CustomRequest extends Request {
    user?: JwtPayload,
    loginUser?: number;
}

export const encryptPassword = async (password: string) => {
    const salt = Number(process.env.BCRYPT_ENCRYPTION_SALT) || 10;
    const encryptPassword = await bcrypt.hash(password, salt);
    return encryptPassword
}

interface NotificationOptions {
    title?: string;
    message: string;
    userType: string;
    ids: number[];
    notificationType: string,
    send_notification?: boolean,
    modelId?: number | null,
    modelName?: string | null;
}

// SEND ADMIN NOTIFICATION
export const sendNotification = async (options: NotificationOptions) => {
    try {
        const {
            message,
            userType,
            ids,
            notificationType,
            send_notification = false,
            modelId,
            modelName
        } = options;

        let tableModel: ModelStatic<Model<any, any>> = (userType === USER_ROLE_CONSTANT.ADMIN) ? AdminNotification : UserNotification;

        let rawData = ids.map((id: any) => ({
            title: message || "",
            notification_type: notificationType,
            model_name: modelName || null,
            model_id: modelId || null,
            [userType === USER_ROLE_CONSTANT.ADMIN ? "admin_id" : "user_id"]: id
        }));

        const createNotifications = await tableModel.bulkCreate(rawData, { returning: true });

        if (send_notification) {

            const io = getIo();

            createNotifications.forEach((notification: any) => {

                const userId = userType === USER_ROLE_CONSTANT.ADMIN ? notification.admin_id : notification.user_id;

                if (userType === USER_ROLE_CONSTANT.ADMIN) {

                    io.to("main_admin").emit("new-message", {
                        id: userId,
                        title: notification.title,
                        message: notification.title,
                        notification_type: notification.notification_type,
                        model_name: notification.model_name,
                        model_id: notification.model_id,
                        notification_id: notification.id,
                    });
                }

                if (userType === USER_ROLE_CONSTANT.USER) {
                    io.to(`User-${userId}`).emit("user-active", {
                        title: notification.title,
                        message: notification.title
                    });

                    if (notification.notification_type === "OTP") {
                        io.to(`User-${userId}`).emit("otp-resend", {
                            title: "OTP Resend",
                            message,
                        });
                    };
                }
            });
        }
    } catch (error: any) {
        Logger.error(`Notification sending error: ${error?.message}`);
        return;
    };
};