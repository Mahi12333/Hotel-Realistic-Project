import { DataTypes } from 'sequelize';
import { sequelize } from "../config/db.js";


const Assect_Highlight = sequelize.define('Assect_Highlight', {
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
    highlightId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'tbl_Assect_Highlight',
    timestamps: true
});

// Assect_Highlight.sync({ alter: true });
// Assect_Highlight.sync({ force: false}); 
// Assect_Highlight.sync({}); 
export default Assect_Highlight;
