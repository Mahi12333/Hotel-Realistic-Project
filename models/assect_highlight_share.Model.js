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
        allowNull: true
    },
    pid:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    type:{
        type: DataTypes.STRING,
        allowNull: true
    },
    highlightId:{
        type: DataTypes.INTEGER,
        allowNull: true
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