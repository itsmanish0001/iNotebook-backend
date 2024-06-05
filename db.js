const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://manishbug21cs:63Az9b3AXHXyJf7l@inotebook.ywdv4ez.mongodb.net/";

const connectToMongo = async() => {
   await mongoose.connect(mongoURI);
   console.log("connected");
}

module.exports = connectToMongo;  