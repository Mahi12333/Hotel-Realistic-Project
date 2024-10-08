import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";


const Folder = sequelize.define('Folder', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        tableName: 'tbl_folder',
        timestamps: true, 
    }
);

// Folder.sync({ alter: true }); //! after change some fields
// Folder.sync();// ! first model


export default Folder