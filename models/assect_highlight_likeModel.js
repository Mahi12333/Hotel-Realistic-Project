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
        tableName: 'tbl_assect_hightlikes',
        timestamps: false, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
);

// HighlightLikes.sync({ alter: true });
// HighlightLikes.sync({ force: false}); 
// HighlightLikes.sync({}); 
export default HighlightLikes