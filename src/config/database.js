const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://shruthida:QMlppRaIQ5crO1Bm@shruthi.ivb5ubm.mongodb.net/");
    console.log('connect DB')
}

module.exports = connectDB;