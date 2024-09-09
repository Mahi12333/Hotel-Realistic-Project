
import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const Emailverify = sequelize.define('Emailverify', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
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
    tableName: 'tbl_emailverify_details',
    timestamps: true, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
});

// Emailverify.sync({ force: true });

export default Emailverify;