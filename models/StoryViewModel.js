import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const StoryView = sequelize.define('StoryView', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    storyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // defaultValue: null,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // defaultValue: null,
    },
    highlightId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // defaultValue: null,
    },
    viewedAt: {
        type: DataTypes.DATE,
        // defaultValue: DataTypes.NOW, // Use Sequelize's built-in NOW for default timestamp
        allowNull: true
    }
},
{
    tableName: 'tbl_storyView',
    timestamps: false, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
});

// Sync the model with the database
// StoryView.sync();
// StoryView.sync({ alter: true });  // Use this if you want to update the schema without dropping the table
// StoryView.sync({ force: false });  // Use this if you don't want to force the table to drop and recreate

export default StoryView;
