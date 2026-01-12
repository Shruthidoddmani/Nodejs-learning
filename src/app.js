const express = require('express');
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const jwtSecretKey = "Shruthi@123"

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/', requestRouter);







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