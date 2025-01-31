const express = require('express');
const router = express.Router();
const User = require("../models/User");
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
   return jwt.sign({_id: _id}, process.env.SECRET, { expiresIn: '1d'});
}

router.post('/login',async(req,res)=>{

    const { email, password } = req.body;

    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({email, token, message: 'loggedIn succesfully'});
    } catch(err){
        res.status(400).json({error:err.message});
    }
});

router.post('/signup',async(req,res)=>{
    const { email, password } = req.body;
 
    try {
      const user = await User.signup(email,password);
      const token = createToken(user._id);
      res.status(200).json({ email, token, message: 'signed up succefully' });
    } catch (err) {
      res.status(400).json({error: err.message});
    }
});

module.exports = router;