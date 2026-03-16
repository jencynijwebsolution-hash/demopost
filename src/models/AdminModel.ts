import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Admin extends Model {
    id: any;
}

Admin.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    tableName: "admin",
    timestamps: false
});

export default Admin;
