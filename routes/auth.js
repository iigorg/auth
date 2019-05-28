const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {User, validateUser, validateLogin} = require('../models/user');

router.post('/register', async (req, res) => {
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
        });

    try {
        await user.save();
        res.send({user: user._id})
    } catch (err) {
        res.status(400).send(err);
    }    
});

router.post('/login', async(req, res) => {
    //Validate
    const {error} = validateLogin(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email or password is not found');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Email or password is not found');

    //Create token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('x-auth-token', token).send(token);
});


module.exports = router;