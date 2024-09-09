
import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const Emailcommition = sequelize.define('Emailcommition', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },

}, {
    tableName: 'tbl_emailcommition_details',
    timestamps: true, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
});

// Emailcommition.sync({ force: true });

export default Emailcommition;