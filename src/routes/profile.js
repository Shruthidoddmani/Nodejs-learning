const express = require('express');
const profileRouter = express.Router();
const validator = require('validator');
const { userAuth } = require('../middleware/auth');
const { validateEditProfileData } = require('../utils/validation');
const UserModel = require('../models/user')



profileRouter.get('/view', userAuth, async (req, res,) => {
    try {
        console.log(req.body.emailId)
        if (!validator.isEmail(req.body.emailId)) {
            res.status(400).send('Invalid email');
        } else {
            const user = await UserModel.findOne({ emailId: req.body.emailId })
            console.log('user', user);
            res.status(200).send(user);
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }

})
profileRouter.patch('/edit', userAuth, async (req, res,) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");
        } 
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser,
        })

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }

})


module.exports = profileRouter;