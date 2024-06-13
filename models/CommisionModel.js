import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


const Commission = sequelize.define('Commission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commission: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  }, {
    tableName: 'tbl_commission', // Set the table name explicitly to match your existing table
    timestamps: false // Set timestamps to false if you don't have createdAt and updatedAt columns
  });

  export default Commission