import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const MyHighlight = sequelize.define('MyHighlight', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: true
    },
    project:{
        type: DataTypes.STRING,
        allowNull: true
    },
    developer:{
        type: DataTypes.STRING,
        allowNull: true
    },
    community:{
        type: DataTypes.STRING,
        allowNull: true
    },
    city:{
        type: DataTypes.STRING,
        allowNull: true
    },
    link:{
        type: DataTypes.STRING,
        allowNull: true
    },
    status:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:0  // Assuming 1 is active, 0 is inactive, 2 is draft
    },
    is_publish:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:0
    }
},
    {
        tableName: 'tbl_myhighlight',
        timestamps: true, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
);

// MyHighlight.sync();
MyHighlight.sync({ alter: true });
// MyHighlight.sync({ force: false}); 
export default MyHighlight