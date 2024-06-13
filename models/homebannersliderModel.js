import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const homeBannerSlider = sequelize.define('homeBannerSlider', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    banner_title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    images_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    images_path:{
        type: DataTypes.STRING,
        allowNull: false
    },
    is_active:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:1
    }
},
    {
        tableName: 'tbl_home_banner_slider',
        timestamps: false, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
);
export default homeBannerSlider