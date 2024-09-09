import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Device_token = sequelize.define('Device_token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      device_token:{
        type: DataTypes.STRING,
        allowNull:false
      },
      createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
      }
         
},
{
    tableName: 'tbl_device_token', // Set the table name explicitly to match your existing table
    timestamps: false // Set timestamps to false if you don't have createdAt and updatedAt columns
});

// Device_token.sync();
// Device_token.sync({ force: true}); 

export default Device_token;