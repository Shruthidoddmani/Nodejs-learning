const AdminAuth = (req, res, next) => {
    const token  = 'xyza';
    if(token === 'xyz'){
        next();
    } else {
        res.send('Token Invalid');
    }
}
const userAuth = (req, res, next) => {
    const token  = 'xyz';
    if(token === 'xyz'){
        next();
    } else {
        res.send('Token Invalid');
    }
}

module.exports = {
    AdminAuth,
    userAuth
}