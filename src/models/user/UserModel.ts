import { timeStamp } from "node:console";
import { sequelize } from "../../config/database";
import { DataTypes, Model } from "sequelize";
import { encryptPassword } from "../../utils/Helper";


class User extends Model {
    public declare id: number;
    public declare name: string;
    public declare email: string;
    public declare password: string;
    public declare status: string
    public declare otp: string | null;
    public declare otpExpiry: Date | null;
    public declare resendToken: string | null;
    public declare isVerified: boolean;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "active", "deactive"),
            allowNull: false,
            defaultValue: "pending"
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otpExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        resendToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: 'user',
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await encryptPassword(user.password);
                };
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = await encryptPassword(user.password);
                }
            }
        }
    }

)

export default User;