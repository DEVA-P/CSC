const jwt = require('jsonwebtoken');
// jwtDecode
module.exports = function (req, res, next) {
    const token = req.cookies.jwt_token; 
    if (!token) { 
        res.redirect('/login')
    }
    else {
        try {
            console.log(token)
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            req.user = decoded; 
            next();
        } catch (error) {
            res.status(400).send('Invalid token')
        }
    }
}
