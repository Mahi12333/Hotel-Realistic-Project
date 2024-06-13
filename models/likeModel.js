import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const UserLikes = sequelize.define('UserLikes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pid:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type:{
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        tableName: 'tbl_likes',
        timestamps: false, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
);
export default UserLikes