const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidate, loginValidate } = require('../validate');





router.post('/register', async (req, res)=>{

    // Validate
    const {error} = registerValidate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    // Check if user exists
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send("Email exists, please try a different one");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try{
        const savedUser = await user.save();
        return res.send({user: savedUser._id});
    }catch(err){
        return res.status(400).send(err);
    }
})

router.post('/login', async (req,res)=>{
    // Validate
    const {error} = loginValidate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check for email
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email does not exists');

    // Compare password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Password is invalid');


    // Create Token
    const token = jwt.sign({user: user._id},process.env.TOKEN_SECRET, {expiresIn: 60*60} );

    res.header('auth-token', token).send(token);

})



module.exports = router;