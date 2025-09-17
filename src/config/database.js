// "mongodb+srv://shruthida:QMlppRaIQ5crO1Bm@shruthi.ivb5ubm.mongodb.net/DevTinder"

const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://shruthida:QMlppRaIQ5crO1Bm@shruthi.ivb5ubm.mongodb.net/DevTinder")
    console.log('DB connected successfully')
}

module.exports = connectDb;