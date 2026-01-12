const express = require('express');
const requestsRouter = express.Router();
const { userAuth } = require('../middleware/auth');


requestsRouter.post('/sendConnection', userAuth, async (req, res, next) => {
    res.status(200).send(req?.user?.firstName + "is sent a connection");
});



module.exports = requestsRouter;