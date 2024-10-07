import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const HighlightShare = sequelize.define('HighlightShare', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    pid:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    type:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    highlightId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
},
    {
        tableName: 'tbl_assect_hightshare',
        timestamps: false, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
);

// HighlightShare.sync({ alter: true });
// HighlightLikes.sync({ force: false}); 
// HighlightShare.sync({}); 
export default HighlightShare