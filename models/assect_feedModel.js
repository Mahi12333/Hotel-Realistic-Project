import { DataTypes } from 'sequelize';
import { sequelize } from "../config/db.js";
import Folder from './FolderModel.js';
import MyFeeds from './myfeedsModel.js';

const Assect_Feed = sequelize.define('Assect_Feed', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    path: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    folderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    feedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    tableName: 'tbl_Assect_Feed',
    timestamps: true
});

// Assect_Feed.sync({ alter: true });
// Assect_Feed.sync({ force: false}); 
// Assect_Feed.sync({}); 
export default Assect_Feed;
