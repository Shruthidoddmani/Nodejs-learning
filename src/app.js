const express = require('express');
const app = express();

app.use('/test', (req, res) => {
    res.send('Hello from test')
})

app.use('/dashboard', (req, res) => {
    res.send('Hello from dashboard')
})

app.use('/profile', (req, res) => {
    res.send('Hello from profile')
})

app.use('/t1', (req, res) => {
    res.send('Hello from t1')
}) 

app.listen(8888, () => {
    console.log('server started');
})