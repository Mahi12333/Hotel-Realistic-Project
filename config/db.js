import { Sequelize } from 'sequelize';
import pg from 'pg'
import dotenv from "dotenv";
dotenv.config();


// process.env.DB_USER,process.env.DB_PASSWORD,
const sequelize = new Sequelize(process.env.DB_DATABASE, {
    // port: process.env.DB_PORT,
    logging:false,
     host: process.env.DB_HOST,
     dialect: 'postgres',
     protocol: 'postgres',
     dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
  
});

// const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: 'localhost',
//     dialect: 'postgres',
//     port: process.env.DB_PORT,
//     logging:false
  
// });



const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully zaid.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
// sequelize.sync({force:true}).then(() => console.log('sucess'))
export { connectDB, sequelize };


