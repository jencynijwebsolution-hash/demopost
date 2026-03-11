import path from "path";
import nodemailer from "nodemailer";
import { convert } from "html-to-text";
import pug from "pug";
import Logger from "../logger";

class MailService {
    to: string;
    from: string;
    name: string;
    url?: string;
    otpCode?: string;

    host: string;
    port: number;
    user: string;
    password: string;

    constructor(to: string, name: string) {
        const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD, MAIL_FROM } = process.env

        if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASSWORD || !MAIL_FROM) {
            throw new Error("Mail credentials are missing");
        }

        this.to = to;
        this.name = name;

        this.from = MAIL_FROM;
        this.host = MAIL_HOST;
        this.port = Number(MAIL_PORT);
        this.user = MAIL_USER;
        this.password = MAIL_PASSWORD;
    }

    private newTransporter() {
        return nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: this.port === 465,
            auth: {
                user: this.user,
                pass: this.password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        })
    }

    private async send(template: string, subject: string, data: any = {}) {
        const html = pug.renderFile(
            path.resolve(`${__dirname}/../views/${template}.pug`),
            {
                subject,
                ...data,
            }
        );

        const mailOption = {
            to: this.to,
            from: this.from,
            subject,
            html,
            text: convert(html, { wordwrap: 130 }),
        };

        try {
            const info = await this.newTransporter().sendMail(mailOption);
            Logger.info(`Mail sent successfully: ${info.response}`);
        } catch (error: any) {
            Logger.error(`Mail sending error: ${error?.message}`);
        }
    }

    async otp(otpCode: string) {
        const data = {
            name: this.name,
            otp: otpCode
        };
        await this.send(
            "otp",
            "your OTP for Account Verification",
            data);
    }

    async status(status: string) {
        const data = {
            name: this.name,
            status: status
        };
        await this.send(
            "status",
            "Account status updated",
            data);
    }
}

export default MailService;

