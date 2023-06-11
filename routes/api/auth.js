
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/Auth');
const User = require('../../model/User');

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server Error');
    }
});

router.post('/', [
    check('email', 'please include a valid email').isEmail(),
    check('password', 'password is required').exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
            }
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(payload,
                config.get('jwtSecret'),
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });

            res.send("user registered");
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Errors');
        }
    }
);

module.exports = router;


// const express=require("express")
// const router=express.Router();
// const jwt =require('jsonwebtoken')
// const config=require('config');
// const bcrypt=require('bcryptjs');
// const{check,validationResult}=require('express-validator');
// const auth =require('../../middleware/Auth')
// const User=require('../../model/User')

// router.get("/",auth, async(req,res)=>{
// try{
//    const  user=await User.findById(req.user.id).select('-password');
//    res.json(user);
// }catch(err){
//     console.err(err.message);
//     res.status(500).sand('server Error');
// }
// });



// router.post('/',

   
//     check('email','please include a valid email').isEmail(),
//     check('password','password is required').exists()
// ,

// async(req,res)=>
// {
//     const errors=validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json({errors:errors.array()});
//     }
//     const{email,password}=req.body;
//     try{
//         let user=await User.findOne({email});
//         if(!user){
//            return res.status(400).json({errors:[{msg:"invalid credentials"}]});
//         }
        
//   const isMatch=await bcrypt.compare(password,user.password);
// if(!isMatch){
//     return res.status(400).json({errors:[{msg:"invalid credintials"}]});
// }
//     const payload={
//         user:{
//             id:user.id
//         }
//     }


//     jwt.sign(payload,
//         config.get('jwtSecret'),
//         {expiresIn:36000},
//         (err,token) =>{ 
//             if(err) throw err;
//             res.json ({token});
//         });
    
//     res.send("user registered");
//     }catch(err){
//         console.error(err.message);
//         res.status(500).send('Server Errors');
//     }
    
//     // console.log(req.body);
//     // res.send('users routes')
// });
// module.exports=router;