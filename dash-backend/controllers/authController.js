const User = require("../models/User");
const CrytoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { isObjectIdOrHexString } = require("mongoose");

module.exports = {
  createUser: async (req, res) => {
    const user = req.body;

    try {
      await admin.auth().getUserByEmail(user.email);
      res.status(400).json({ message: "Email Already Registered!" });
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        try {
          const userResponse = await admin.auth().createUser({
            email: user.email,
            password: user.password,
            emailVerified: false,
            disabled: false,
          });
          console.log(userResponse.uid);

          const newUser = new User({
            username: user.username,
            email: user.email,
            password: CrytoJs.AES.encrypt(
              user.password,
              process.env.SECRET
            ).toString(),
            uid: userResponse.uid,
            userType: "Client",
          });

          await newUser.save();
          res.status(201).json({ status: true });
        } catch (err) {
          res.status(500).json({ status: false, err: "Error Creating a  User!"});
        }
      }
    }
  },

   loginUser: async (req, res) =>{
      try{
          const user = await User.findOne({email:  req.body.email},{__v: 0, updatedAt: 0, createdAt: 0})
          !user && res.status(401).json("Wrong Credentials");

          const decryptedPassword = CrytoJs.AES.decrypt(user.password, process.env.SECRET);

           const decrypt = decryptedPassword.toString(CrytoJs.enc.Utf8);

         decrypt !== req.body.password &&
         res.status(401).json("Wrong password or username!");

         const userToken = jwt.sign({id: user._id, userType: user.userType, 
            email: user.email
         }, process.env.JWT_SEC, {expiresIn: "5d"});

         const  { password, email, ...others } = user._doc;

         res.status(200).json({ ...others, userToken})

      }catch(err){
        res.status(500).json({ status: false, err: err.message});
      }
   }
};
