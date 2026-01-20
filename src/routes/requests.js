const express = require('express');
const requestsRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const connectionRequestModel = require('../models/connectionRequests');
const UserModel = require('../models/user');


requestsRouter.post('/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;
        const status = req.params.status;

        const toUserExists = await UserModel.findById(toUserId);
        if (!toUserExists) {
            return res.status(400).status('user not exists');
        }
        const connectionRequest = new connectionRequestModel({
            fromUserId,
            toUserId,
            status
        })
        const existingConnectionRequest = await connectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        console.log(existingConnectionRequest);
        if (existingConnectionRequest) {
            return res.status(400).json({
                message: 'Connection request already exists'
            })
        }
        const data = await connectionRequest.save();
        res.status(200).json({
            message: "connection request sent successfully!",
            data,
        })

    } catch (err) {
        res.status(400).status('ERROR: ' + err.message);
    }
});




module.exports = requestsRouter;