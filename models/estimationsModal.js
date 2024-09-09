import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const Estimation = sequelize.define('Estimation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quarter:{
        type: DataTypes.STRING,
        allowNull: false
    },
    year:{
        type: DataTypes.STRING,
        allowNull: false 
    }
  
},
    {
        tableName: 'tbl_estimations',
        timestamps: true, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
);

export default Estimation