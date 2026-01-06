const express = require('express');
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');
const { validateSignUpData, logiValidate } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
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
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const token = jwt.sign({
                    emailId: user.emailId,
                    userId: user._id
                }, jwtSecretKey)
                res.cookie('token', token)
                res.status(200).send('Login success')
            } else {
                res.status(400).send('Invalid credentials');
            }
        });

    } catch (err) {
        res.status(400).send('ERROR : ' + err.message)
    }

})

app.get('/profile', async (req, res) => {
    try {
        const { token } = req.cookies;
        if(!token){
            throw new Error('Invalid token');
        }
        jwt.verify(token, jwtSecretKey, async (err, response) => {
            if (err) {
                res.status(400).send('Invalid Signature!!!');
            } else {
                const user = await User.findOne({ emailId: response?.emailId, _id: response?.userId })
                if (!user) {
                    throw new Error('User is not valid');
                }
                res.send(user);
            }
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }

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


// Get users by email id
app.get('/user', async (req, res) => {
    try {
        const emailId = req.body.emailId;
        const result = await User.find({ emailId });
        if (result.length > 0) {
            res.status(200).send(result);
        } else {
            res.status(401).send('User not found');
        }
    } catch (err) {
        res.status(401).send('Something went wrong');
    }
})

app.get('/getUserById', async (req, res) => {
    try {
        const id = req.body.userId;
        const result = await User.findById(id);
        // console.log(result);
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(401).send('Something went wrong');
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('Something went wrong');
    }
})

app.delete('/user', async (req, res) => {
    try {
        const id = req.body.userId;
        console.log(id);
        const result = await User.findOneAndDelete({ _id: id });
        console.log(result);
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(401).send('Something went wrong');
        }
    } catch (err) {
        res.status(401).send('Something went wrong');
    }
})

app.patch('/user/:userId', async (req, res) => {
    try {
        const id = req.params?.userId;
        const emailId = req.body.emailId;
        console.log(id);
        const data = req.body;
        const ALLOWED_UPDATES = ['userId', "password", "firstname", "lastName", "gender", "age", "skills", "about"]
        const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));
        const result = await User.findOneAndUpdate({ emailId }, data, {
            returnDocument: 'after',
            runValidators: true
        });
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(401).send('Something went wrong');
        }
    } catch (err) {
        res.status(401).send('Something went wrong  ' + err.message);
    }
})

connectDb().then(() => {
    app.listen(8888, () => {
        console.log("Server Started");
    })
}).catch((err) => {
    console.log("Error: ", err);
})