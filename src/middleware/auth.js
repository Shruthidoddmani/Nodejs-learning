const User = require('../models/user');
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(400).send('token is not valid')
        }

        jwt.verify(token, "Shruthi@123", async (err, result) => {
            if (err) {
                res.status(400).send('Invalid token');
            } else {
                const user = await User.findOne({ emailId: result.emailId, _id: result.userId });
                if (!user) {
                    res.status(400).send('Invalid user');
                }
                req.user = user;
                next();
            }
        })
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
}

module.exports = {
    userAuth
}