import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";



const Amenity = sequelize.define('Amenity', {
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
      type: DataTypes.STRING, // Assuming images are stored as JSON data
      allowNull: false // Change to false if images are required
    },
    is_active: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: true // Assuming amenities are active by default
    }
  }, {
    tableName: 'tbl_amenitities', // Set the table name explicitly to match your existing table
    timestamps: false // Set timestamps to false if you don't have createdAt and updatedAt columns
  });
 


  export default Amenity