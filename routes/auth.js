const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const { check, validationResult } = require('express-validator');

const JWT_SECRET = 'Manishisagood@boy';

router.post('/createuser', [

    check('name').isLength({min: 3}),
    check('email').isEmail(),
    check('password').isLength({min : 5})
   

] ,async(req, resp) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return resp.status(400).json({errors: errors.array() , "success" : false});
    }

    try{

    let user = await User.findOne({"email": req.body.email});
    if(user){
        return resp.status(400).json({"error" : "user already exist", "success": false});
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    
   
    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email
    });

    const data = {
        user:{
            id:user.id
        }
    }
    console.log(user.id);

    const JWT_SECRET = 'Manishisagood@boy';

    const authToken = jwt.sign(data, JWT_SECRET);
    console.log(authToken);



    // resp.json(user);
    resp.json({ "success":true, authToken});
    

    }    

    catch(error){
        console.log(error.msg);
        resp.status(500).send("some error occured");
    }

    
});



router.post('/login', [
    
    check('email').isEmail(),
    check('password').exists(),


], async(req, resp) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return resp.status(400).json({errors: errors.array() });
    }

    const {email , password} = req.body;
    try{
        let user = await User.findOne({"email" : email});
        if(!user){
            return resp.status(400).json({error: "please try to login with correct credentials"});
        }

        const passwordcompare = await bcrypt.compare(password, user.password);
        if(!passwordcompare){
            return resp.status(600).json({error: "please try to login with correct credentials", "success" : false});
        }

        const data = {
            user:{
                id:user.id
            }
        }

        console.log(user.id);
       
        const authToken = jwt.sign(data, JWT_SECRET);
        const success = true;
        resp.json({success, authToken});

    }

    catch(errors){
        console.log(errors.message);
        resp.status(500).send("internal server error");
    }

})


router.post('/getuser', fetchuser, async(req, resp) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        resp.send(user);
    }

    catch(error){
        console.error(error.message);
        resp.status(500).send("internal server error");

    }
})




module.exports = router;