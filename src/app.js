const express = require('express');
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');
const { validateSignUpData, logiValidate } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middleware/auth');
const jwtSecretKey = "Shruthi@123"

app.use(express.json());
app.use(cookieParser());
// create user
app.post('/signUp', async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.status(200).send('User created successfully');
    } catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    }
})

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        logiValidate(req);
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error('Invalid credentials')
        }
        const isPasswordValid = user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            if (token) {
                res.cookie('token', token, {expires: new Date(Date.now() + 1 * 3600000)})
                res.status(200).send('Login success')
            } else{
                res.status(400).send('Failed to login user');
            }
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (err) {
        res.status(400).send('ERROR : ' + err.message)
    }

})

app.get('/profile', userAuth, async (req, res,) => {
    try {
        const { user } = req;
        res.status(200).send(user.firstName + 'is connected');
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }

})

app.post('/sendConnection', userAuth, async (req, res, next) => {
    res.status(200).send(req?.user?.firstName + "is sent a connection");
})
// fetch all the users 
app.post('/findUser', async (req, res) => {
    try {
        const user = User.findOne({ emailId: req.body.emailId })
        if (!user) {
            res.status(200).send('User exists');
        } else {
            res.status(401).send('User not found');
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('Something went wrong');
    }
})




connectDb().then(() => {
    app.listen(8888, () => {
        console.log("Server Started");
    })
}).catch((err) => {
    console.log("Error: ", err);
})