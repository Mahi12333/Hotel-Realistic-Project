import Amenity from "./amenetiesModel.js";
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";



const ProjectAmenity = sequelize.define('ProjectAmenity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    is_check: {
      type: DataTypes.STRING,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'tbl_project_amenitities', // Set the table name explicitly to match your existing table
    timestamps: false // Set timestamps to false if you don't have createdAt and updatedAt columns
  });

  // ProjectAmenity.sync({force:true})


  

  export default ProjectAmenity