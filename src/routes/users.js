const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequests');
const UsersModel = require('../models/user');
// get all the pending connection request from the logged in user
userRouter.get('/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", ["firstName", "lastName"])
        res.status(200).json({ data: connectionRequests });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

// get the connected users for the logged in user
userRouter.get("/connections", userAuth, async (req, res) => {
    const loggedInuUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
        $or: [
            { toUserId: loggedInuUser._id, status: 'accepted' },
            { fromUserId: loggedInuUser._id, status: 'accepted' }
        ]
    }).populate("fromUserId", ['firstName', 'lastName']).populate('toUserId', ['firstName', 'lastName']);

    const data = connectionRequests.map(row => {
        if (row.fromUserId._id.toString() === loggedInuUser._id.toString()) {
            return row.toUserId
        } else
            return row.fromUserId
    })
    res.status(200).json({ data: connectionRequests });
})

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit
        const skip = (page-1) * limit
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }
        ).select('fromUserId toUserId')

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })

        const users = await UsersModel.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select('firstName lastName')
        .skip(skip)
        .limit(limit);
        res.json({data: users})
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }

})
module.exports = userRouter;