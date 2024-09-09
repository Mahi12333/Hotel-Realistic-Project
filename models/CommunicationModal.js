import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


const Communication = sequelize.define('Communication', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mode_of_communication: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    tableName: 'tbl_communication', // Set the table name explicitly to match your existing table
    timestamps: false // Set timestamps to false if you don't have createdAt and updatedAt columns
  });

  export default Communication