import { sequelize } from "../../config/database";
import { DataTypes, Model } from "sequelize";

class UserNotification extends Model {
    public declare id: number;
    public declare user_id: number;
    public declare title: string;
    public declare notification_type: string;
    public declare model_name: string;
    public declare model_id: number;
}

UserNotification.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        notification_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        model_name: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        model_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            defaultValue: null
        }
    },
    {
        sequelize,
        timestamps: true,
        tableName: "UserNotification",
        createdAt: "created_at",
        updatedAt: "updated_at",
        underscored: true
    }

)

export default UserNotification;