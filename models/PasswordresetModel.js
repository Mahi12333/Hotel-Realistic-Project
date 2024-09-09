import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Passwordreset = sequelize.define('PasswordReset', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'tbl_password_reset',
    timestamps: true,
    updatedAt: false,
});

  
export default Passwordreset