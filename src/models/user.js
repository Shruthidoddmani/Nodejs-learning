const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    firstName: {
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
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address ' + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Enter a Strong password')
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },
    skills: {
        type: [String]
    },
    about: {
        type: String,
        default: "I'm about"
    },
    photoUrl: {
        type: String,
        default: 'https://userImage.png',
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid Photo URL address' + value)
            }
        }
    }
}, {
    timestamps: true
})

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({
        emailId: user.emailId,
        userId: user._id
    }, "Shruthi@123", { expiresIn: '1d' });

    return token;
}

userSchema.methods.validatePassword = async function (inputPassword) {
    const user = this;

    const isPasswordValid = await bcrypt.compare(inputPassword, user.password);

    return isPasswordValid;
}
module.exports = mongoose.model('Users', userSchema);