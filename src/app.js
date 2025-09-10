const express = require('express');
const app = express();
const { AdminAuth, userAuth } = require('./middleware/auth')

app.use('/admin', AdminAuth);
// app.use('/user', userAuth);
app.get('/admin/profile', (req, res, next) => {
    res.send('hello admin profile')
})

app.use('/user', userAuth, (req, res, next) => {
    console.log('/user')
    res.send('user URL')
})

app.use('/user/login', (req, res, next) => {
    console.log('/user/login')
    res.send('/user/login logged in successfully')
})



app.listen(8888, () => {
    console.log('server started');
})