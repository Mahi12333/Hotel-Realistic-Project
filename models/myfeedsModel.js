import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";


const MyFeeds = sequelize.define('MyFeeds', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    source_type:{
        type: DataTypes.STRING,
        allowNull: true
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
    link:{
        type: DataTypes.STRING,
        allowNull: true
    },
    describtion:{
        type: DataTypes.STRING,
        allowNull: true
    },
    describtion2:{
        type: DataTypes.STRING,
        allowNull: true
    },
    city:{
        type: DataTypes.STRING,
        allowNull: true
    },
    status:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:0   // Assuming 1 is active, 0 is inactive, 2 is draft
    },
    is_publish:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:0
    },
    slug:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
},
    {
        tableName: 'tbl_myfeeds',
        timestamps: true, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
);

// MyFeeds.sync({ alter: true });
// MyFeeds.sync();
export default MyFeeds