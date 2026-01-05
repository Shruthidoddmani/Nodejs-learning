const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: { 
        type: String
    },
    emailId: { 
        type: String,
        required: true,
        unique: true, // to create unique email id
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {  
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    skills:{
        type: [String]
    },
    about:{
        type: String,
        default:"I'm about"
    }
},{
    timestamps : true
})

module.exports = mongoose.model('Users', userSchema);