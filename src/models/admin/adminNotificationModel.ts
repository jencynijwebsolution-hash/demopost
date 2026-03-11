import { timeStamp } from "node:console";
import { sequelize } from "../../config/database";
import { DataTypes, Model } from "sequelize";

class AdminNotification extends Model {
    forEach(arg0: (admin: any) => void) {
        throw new Error("Method not implemented.");
    }

    public declare id: number;
    public declare admin_id: number;
    public declare title: string;
    public declare notification_type: string;
    public declare model_name: string;
    public declare model_id: number;
}

AdminNotification.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notification_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        model_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        model_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            defaultValue: null
        }
    },
    {
        sequelize,
        tableName: 'AdminNotification',
        timestamps: true,
    }
)

export default AdminNotification;