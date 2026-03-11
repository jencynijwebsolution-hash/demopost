import { Response, NextFunction } from "express";
import { CustomRequest, sendNotification } from "../utils/helper";
import User from "../models/user/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "../utils/ApiError";

interface DecodedToken extends jwt.JwtPayload {
    id: string;
};

export const authenticate = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let token: string | undefined;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies['jwt']) {
            token = req.cookies['jwt'];
        }

        if (!token) {
            return res.status(401).json({
                message: "invalid token",
            })
        }

        if (!process.env.TOKEN_SECRET_KEY) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }

        token = token.trim();

        const decoded = verifyToken(token, process.env.TOKEN_SECRET_KEY as jwt.Secret);

        if (!decoded.id) {
            return next(new ApiError("Invalid token format: missing admin ID.", 401));
        }

        const currentUser = await User.findByPk(decoded.id, {
            attributes: ["id"]
        });

        if (!currentUser) {
            return next(new ApiError("The admin account no longer exists.", 401));
        }

        req.loginUser = currentUser.id;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "invalid token"
        })
    }
}

const verifyToken = (token: string, secret: jwt.Secret): DecodedToken => {
    try {
        const decoded = jwt.verify(token, secret);

        if (typeof decoded === "string") {
            throw new ApiError("Invalid token format.", 401);
        }

        return decoded as DecodedToken;

    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            throw new ApiError("Your token has expired. Please log in again.", 401);
        }

        if (err.name === "JsonWebTokenError") {
            throw new ApiError("Invalid token. Please log in again.", 401);
        }

        throw err;
    }
};
export default authenticate;

