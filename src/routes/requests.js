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
        const allowedStatus = ["ignored", "interested"].includes(status);


        if (!allowedStatus) {
            return res.status(400).json({
                message: "Enter a valid status"
            })
        }
        // if(toUserId == fromUserId){
        //     return res.status(400).json({
        //         message: "Can't send a request to the logged in user"
        //     })
        // }
        const toUserExists = await UserModel.findById(toUserId);
        if (!toUserExists) {
            return res.status(400).send('User not found');
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
        // console.log(existingConnectionRequest);
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
        res.status(400).send('ERROR: ' + err.message);
    }
});

requestsRouter.post('/review/:status/:requestId', userAuth, async (req, res) => {
    const { status, requestId } = req.params;
    const loggedInUserId = req.user._id;

    const allowedStatus = ['rejected', 'accepted'];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message:'invalid status'
        });
    }

    const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested"
    })
    
    if(!connectionRequest){
        return res.status(404).json({
            message:"Connection request not found"
        })
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.status(200).json({
        message: "Connection request "+ status , data
    })
    
})




module.exports = requestsRouter;