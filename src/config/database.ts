import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,//max open conn
            min: 0,//min open conn
            acquire: 30000,//time to try before error
            idle: 10000,//time before releasing idle connection
        },
    });

