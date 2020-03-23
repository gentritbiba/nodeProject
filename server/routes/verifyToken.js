const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    const token = req.header('auth-token');
    if(!token)res.status(401).send('Access Denied');

        jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded){
            if(err){
                res.status(400).send(err);
            }
            else{
                req.user = decoded;
                next();
            }
        })
}