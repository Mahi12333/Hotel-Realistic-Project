import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const HighlightLikes = sequelize.define('HighlightLikes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    pid:{
        type: DataTypes.INTEGER,
        type: DataTypes.INTEGER,
        allowNull: true // Change this to true if null is acceptable
    },
    type:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    highlightId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    }
},
    {
        tableName: 'tbl_assect_hightlikes',
        timestamps: false, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
);

// HighlightLikes.sync({ alter: true });
// HighlightLikes.sync({ force: false}); 
// HighlightLikes.sync({}); 
export default HighlightLikes