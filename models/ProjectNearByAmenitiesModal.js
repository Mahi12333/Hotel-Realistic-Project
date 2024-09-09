import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ProjectNearByAmenity = sequelize.define('ProjectNearByAmenity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    percentage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'tbl_project_near_by_amenities', // Set the table name explicitly to match your existing table
    timestamps: true // Set timestamps to false if you don't have createdAt and updatedAt columns
});




export default ProjectNearByAmenity


