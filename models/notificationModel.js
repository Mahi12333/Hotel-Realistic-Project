import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      massage:{
        type: DataTypes.STRING,
        allowNull:false
      },
      read: { type: DataTypes.BOOLEAN, defaultValue:false },
      createdAt: { type: DataTypes.DATE, defaultValue: Date.now }
},
{
    tableName: 'tbl_notification', // Set the table name explicitly to match your existing table
    timestamps: false // Set timestamps to false if you don't have createdAt and updatedAt columns
});

// Notification.sync();

export default Notification;