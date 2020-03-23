const router = require('express').Router();
const verify = require('./verifyToken');


// Test private page
router.get('/', verify, (req, res)=>{
    res.json({posts: {title:"test", user: req.user}});
});

module.exports = router;