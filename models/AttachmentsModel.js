import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Attachments = sequelize.define('Attachments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filepath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        tableName: 'tbl_attachments', // Set the table name explicitly to match your existing table
        timestamps: true // Set timestamps to false if you don't have createdAt and updatedAt columns
    }
);

  
export default Attachments