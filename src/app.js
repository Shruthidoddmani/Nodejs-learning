const express = require('express');
const app = express();
const { AdminAuth, userAuth } = require('./middleware/auth')
const connectDB = require('./config/database');

connectDB().then(() => {
    app.listen(8888, () => {
        console.log('server started');
    })
}).catch(() => {
    console.log('Failed to connectd DB')
})





