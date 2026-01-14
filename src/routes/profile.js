const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const { validateEditProfileData } = require('../utils/validation');
const { Users } = require('../models/user')

profileRouter.patch('/edit', userAuth, async (req, res,) => {
    try {
        if(!validateEditProfileData(req)){
            res.status(400).send('Invalid data');
        }else{
            const user = await Users.findOneAndUpdate({emailId: req.body.emailId}, {...req.body}, {
                returnDocument:'after'
            })
            console.log('user', user);
            res.status(200).send(user);
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }

})


module.exports = profileRouter;