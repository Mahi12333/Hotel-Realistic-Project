import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const UserShares = sequelize.define('UserShares', {
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
    feedId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    type:{
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        tableName: 'tbl_shares',
        timestamps: true, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
);


// UserShares.sync();
// UserShares.sync({ alter: true });
// UserShares.sync({ force: false}); 


export default UserShares