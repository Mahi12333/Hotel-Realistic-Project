import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const Developers = sequelize.define('Developers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    img: {
        type: DataTypes.TEXT,
        allowNull: true
    },
  
},
    {
        tableName: 'tbl_developers',
        timestamps: true, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
);

export default Developers