import jwt from "jsonwebtoken";

// GENERATE ADMIN LOGIN TOKEN
export const userLoginToken = (id: string) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET_KEY as jwt.Secret, { expiresIn: "1d" });
};