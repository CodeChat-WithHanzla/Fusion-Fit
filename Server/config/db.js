const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });

const connectDB = async () => {
  mongoose
    .connect(`${process.env.MONGODB_CLOUD}/${process.env.DB_NAME}`)
    .then((conn) =>
      console.log(`Connected to MongoDB Atlas: ${conn.connection.host}`)
    )
    .catch((err) => console.log(`Error connecting to MongoDB Atlas: ${err}`));
};

module.exports = connectDB;
