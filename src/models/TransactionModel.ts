import { sequelize } from "../config/database";
import { DataTypes, Model } from "sequelize";

class Transaction extends Model {
    public declare id: number;
    public declare user_id: number;
    public declare type: string;
    public declare amount: number;
    public declare opening_balance: number;
    public declare closing_balance: number;
    public declare status: string;
    public declare remark: string;
}

Transaction.init(
{
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    type: {
        type: DataTypes.ENUM("deposit","withdrawal"),
        allowNull: false
    },

    sign:{
         type: DataTypes.STRING,
        allowNull: false
    },

    amount: {
        type: DataTypes.DECIMAL(14,2),
        allowNull: false
    },

    opening_balance: {
        type: DataTypes.DECIMAL(14,2),
        allowNull: false
    },

    closing_balance: {
        type: DataTypes.DECIMAL(14,2),
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM("pending","success","failed"),
        defaultValue: "pending"
    },

    remark: {
        type: DataTypes.TEXT,
        allowNull: true
    }

},
{
    sequelize,
    tableName: "transactions",
    timestamps: true
}
);

export default Transaction;