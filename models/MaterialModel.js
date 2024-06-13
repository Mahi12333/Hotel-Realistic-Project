import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Material = sequelize.define('Material', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_type: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        tableName: 'tbl_marketing_material', // Set the table name explicitly to match your existing table
        timestamps: false // Set timestamps to false if you don't have createdAt and updatedAt columns
    }
);

  
export default Material
