import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";



const New_Project = sequelize.define('New_Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  project_title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estimation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
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
  }
}, {
  tableName: 'tbl_new_projects', // Set the table name explicitly to match your existing table
  timestamps: true // Set timestamps to false if you don't have createdAt and updatedAt columns
});

// Project.sync({alter:true})
// New_Project.sync();


export default New_Project;


