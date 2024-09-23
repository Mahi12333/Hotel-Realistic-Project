import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const Common_project = sequelize.define('Common_project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: true
    },
  
},
    {
        tableName: 'tbl_common_project',
        timestamps: true, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
);

// Common_project.sync({ force: false}); 

export default Common_project