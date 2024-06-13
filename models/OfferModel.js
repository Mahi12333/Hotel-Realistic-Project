import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Offer = sequelize.define('Offer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'tbl_offers', // Set the table name explicitly to match your existing table
    timestamps: false // Set timestamps to false if you don't have createdAt and updatedAt columns
  });

  export default Offer;