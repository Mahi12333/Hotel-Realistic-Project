import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const NearByAmenity = sequelize.define('NearByAmenity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    images: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'tbl_nearby_amenitities', // Set the table name explicitly to match your existing table
    timestamps: true // Set timestamps to false if you don't have createdAt and updatedAt columns
  });
  // Place.sync({force:true})


  export default NearByAmenity


