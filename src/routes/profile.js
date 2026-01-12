const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middleware/auth')

profileRouter.get('/edit', userAuth, async (req, res,) => {
    try {
        const { user } = req;
        res.status(200).send(user.firstName + 'is connected');
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }

})


module.exports = profileRouter;