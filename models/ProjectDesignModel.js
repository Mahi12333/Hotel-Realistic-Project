import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const ProjectDesignType = sequelize.define('ProjectDesignType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    project_design_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING
    },
},
    {
        tableName: 'tbl_project_images',
        timestamps: false,
       
    }
)


export default ProjectDesignType