import { sequelize } from "../config/database";
import { DataTypes, Model } from "sequelize";

class Deposit extends Model {
    forEach(arg0: (admin: any) => void) {
        throw new Error("Method not implemented.");
    }

    public declare id: number;
    public declare user_id: number;
    public declare amount: string;
    public declare payment_method: string;
    public declare status: String;
    public declare remark: String
}

Deposit.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(14,2),
            allowNull: false,
        },
        payment_method: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM("pending", "success", "failed"),
            defaultValue: "pending"
        },
        remark: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'deposit',
        timestamps: true,
    }
)

export default Deposit;