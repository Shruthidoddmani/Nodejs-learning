const mongoose = require('mongoose');

const connectionRequstSchema = new mongoose.Schema(
    {

        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,

        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignore", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`
            }
        }

    },
    {
        timestamps: true
    }) 

    connectionRequstSchema.pre("save", function (next) {
        const connectionRequest = this;
        if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
            throw new Error("cannot send a connection to yourself");
        }
        next(); 
    })

module.exports = mongoose.model('ConnectionRequest', connectionRequstSchema);