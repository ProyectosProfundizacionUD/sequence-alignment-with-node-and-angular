const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.BD_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection with MongoDB is OK");
  } catch (e) {
    console.log("Error connecting to MongoDB: ", e);
  }
}

module.exports = { dbConnection }