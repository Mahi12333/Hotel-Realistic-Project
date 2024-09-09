import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


const ProjectTrack = sequelize.define('ProjectTrack', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    projectname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    share: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    bookmark: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    like: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
},{
    tableName: 'tbl_tracks_records', // Set the table name explicitly to match your existing table
    timestamps: true // Set timestamps to false if you don't have createdAt and updatedAt columns
  });

export default ProjectTrack;