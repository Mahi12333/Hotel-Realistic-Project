import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";
import Folder from './FolderModel.js';

const Assect_image = sequelize.define('Assect_image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    folderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'tbl_assets',
    timestamps: true
});


// Assect_image.sync();
// Assect_image.sync({ force: false}); 
// Assect_image.sync({ alter: true }); 


export default Assect_image