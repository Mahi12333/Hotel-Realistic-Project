import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


const Watchlater = sequelize.define('Watchlater', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_check: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
},
 {
    tableName: 'tbl_watch_later', // Set the table name explicitly to match your existing table
    timestamps: true // Set timestamps to false if you don't have createdAt and updatedAt columns
}
)
export default Watchlater

