
import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const HomeSchema = sequelize.define('HomeSchema', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    redirect_link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    banner_img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_active: {
        type: DataTypes.STRING
    },
     types: {    // By Mahitosh
        type: DataTypes.STRING,
        allowNull: false
    },
},
    {
        tableName: 'tbl_homebanner',
        timestamps: true, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
)


export default HomeSchema
