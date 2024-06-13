import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";



const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  project_banner: {
    type: DataTypes.STRING,
    allowNull: false
  },
  developer_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  community_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  project_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  starting_price: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estimation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bedroom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area_starts: {
    type: DataTypes.STRING,
    allowNull: false
  },
  service_charge: {
    type: DataTypes.STRING,
    allowNull: false
  },

  commission: {
    type: DataTypes.STRING,
    allowNull: false
  },
  step:{
      type: DataTypes.STRING,
      allowNull: false
  },
  is_publish: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'tbl_projects', // Set the table name explicitly to match your existing table
  timestamps: true // Set timestamps to false if you don't have createdAt and updatedAt columns
});

// Project.sync({alter:true})



export default Project;


