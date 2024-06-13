import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const MyFeeds = sequelize.define('MyFeeds', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    caption:{
        type: DataTypes.STRING,
        allowNull: false
    },
    project_type:{
        type: DataTypes.STRING,
        allowNull: false
    },
    highlight:{
        type: DataTypes.STRING,
        allowNull: false
    },
    link:{
        type: DataTypes.STRING,
        allowNull: false
    },
    assets_banner:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:1
    },
    is_publish:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:0
    }
},
    {
        tableName: 'tbl_myfeeds',
        timestamps: false, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
);
export default MyFeeds