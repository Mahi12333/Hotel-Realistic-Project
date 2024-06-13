import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Place = sequelize.define('Place', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    place: {
      type: DataTypes.STRING,
      allowNull: false
    },
    place_time: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'tbl_places', // Set the table name explicitly to match your existing table
    timestamps: false // Set timestamps to false if you don't have createdAt and updatedAt columns
  });
  // Place.sync({force:true})


  export default Place


