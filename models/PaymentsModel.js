import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    installment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'tbl_payment', // Set the table name explicitly to match your existing table
    timestamps: false // Set timestamps to false if you don't have createdAt and updatedAt columns
  });
  
  export default Payment