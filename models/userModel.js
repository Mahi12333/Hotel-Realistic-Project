

import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING
    },
    last_name: {
        type: DataTypes.STRING
    },
    logo: {
        type: DataTypes.STRING
    },
    company_name: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    communication: {
        type: DataTypes.TEXT
    },
    role: {
        type: DataTypes.STRING
    },

    is_active: {
        type: DataTypes.STRING
    },
    team_name: {
        type: DataTypes.STRING
    },
    channel_ptn_id: {
        type: DataTypes.INTEGER
    },
    contact_number: {
        type: DataTypes.STRING,
        validate: {
          is: {
            args: /^[0-9]{10,15}$/,
            msg: 'Contact number must be between 10 and 15 digits and contain only numbers.'
          }
        }
    }
}, {
    tableName: 'tbl_user_details',
    timestamps: true, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
});



export default User;