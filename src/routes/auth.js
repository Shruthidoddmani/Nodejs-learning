const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { validateSignUpData,
    loginValidate } = require('../utils/validation');
const User = require('../models/user');

authRouter.use(cookieParser());


authRouter.post('/signUp', async (req, res) => {
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

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        loginValidate(req);
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error('Invalid credentials')
        }
        const isPasswordValid = user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            if (token) {
                res.cookie('token', token, { expires: new Date(Date.now() + 1 * 3600000) })
                res.status(200).send('Login success')
            } else {
                res.status(400).send('Failed to login user');
            }
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (err) {
        res.status(400).send('ERROR : ' + err.message)
    }

})




module.exports = authRouter;