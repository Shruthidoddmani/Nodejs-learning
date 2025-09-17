const express = require('express');
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');

app.use(express.json());
// create user
app.post('/signUp', async (req, res) => {
    try {
        console.log(req.body);
        const user = new User(req.body);
        await user.save();
        res.status(200).send('User created successfully');
    } catch (err) {
        console.log(err);
        res.status(401).send('Something went wrong');
    }
})

// fetch all the users 
app.post('/feed', async (req, res) => {
    try {
        const user = User.findOne({ emailId: req.body.emailId })
        if (!user) {
            res.status(200).send('User created successfully');
        } else {
            res.status(401).send('Something went wrong');
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
            res.status(401).send('Something went wrong');
        }
    } catch (err) {
        res.status(401).send('Something went wrong');
    }
})

app.get('/getUserById', async (req, res) => {
    try {
        const id = req.body.userId;
        const result = await User.findById(id);
        console.log(result);
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
        const result = await User.findOneAndDelete({_id : id});
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

connectDb().then(() => {
    app.listen(8888, () => {
        console.log("Server Started");
    })
}).catch((err) => {
    console.log("Error: ", err);
})