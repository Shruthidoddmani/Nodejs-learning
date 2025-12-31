// "mongodb+srv://shruthida:QMlppRaIQ5crO1Bm@shruthi.ivb5ubm.mongodb.net/DevTinder"

const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://shruthida2000_db_user:T2pblAn6iP9BOKht@cluster0.rwbzlaq.mongodb.net/devTinder")
    console.log('DB connected successfully')
}

module.exports = connectDb;