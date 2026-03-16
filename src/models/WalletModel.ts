import { sequelize } from "../config/database";
import { DataTypes, Model } from "sequelize";

class Wallet extends Model {
    public declare id: number;
    public declare user_id: number;
    public declare balance: number;
};

Wallet.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00
        }
    },
    {
        sequelize,
        tableName: 'wallet',
        timestamps: true,
        paranoid: true,
        underscored: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

export default Wallet;