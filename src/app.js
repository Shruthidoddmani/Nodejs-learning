const express = require('express');
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');

app.use(express.json());
// create user
app.post('/signUp', async (req, res) => {
    try {
        const ALLOWED_FIELDS = ['userId', "password", "firstname", "lastName", "gender", "age", "skills", "about"]
        const isAllowedToAddUser = Object.keys(req.body).every(k => ALLOWED_FIELDS.includes(k));
        const user = new User(req.body);
        await user.save();
        res.status(200).send('User created successfully');
    } catch (err) {
        // console.log(err);
        res.status(401).send(err);
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