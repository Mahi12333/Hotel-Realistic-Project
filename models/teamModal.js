import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    inventory_details: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    project_details: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    register_interest: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'tbl_teams', // Set the table name explicitly to match your existing table
    timestamps: true // Set timestamps to false if you don't have createdAt and updatedAt columns
});

export default Team;