const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req,res,next) => {

    //verify authentication
    const { authorization } = req.headers;

    if(!authorization){

        return res.status(401).json({error: "Authorization token required"});

    }

    //getting the token at pos 1
    const token = authorization.split(' ')[1];

    try{
        const {_id} = jwt.verify(token, process.env.SECRET);

        //stores the user in the user object
        req.user = await User.findOne({_id}).select('_id');
        next();

    }catch(error){
        console.log(error);
        res.status(401).json({error: 'request is not authorized'});
    }

}

module.exports = requireAuth;