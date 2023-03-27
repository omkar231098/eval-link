const express = require("express");
const { UserModel } = require("../Model/user.model");
const bycrypt = require("bcrypt");
userRouter = express.Router();
const jwt = require("jsonwebtoken");

// const { authenticate } = require("../middlewares/authenticator");


// post route to register the user

userRouter.post("/register", async (req, res) => {
    const { name, email,gender, password ,age,city,is_married} = req.body;
  
    try {
      const UserPresent = await UserModel.findOne({ email });
  
      if (UserPresent) {
        res.status(200).send({ Message: "User already exist, please login" });
      }
      const HashPassword = await bycrypt.hash(password, 12);
      const NewUser = new UserModel({
        name,
        email,
        gender,
        password: HashPassword,
        age,
        city,
        is_married
      });
  
      await NewUser.save();
  
      res.status(200).send({ Message: "Save Successfully" });
    } catch (err) {
      res.status(404).send(err);
    }
  });


  
// post route to login the user

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const UserPresent = await UserModel.findOne({ email });
      if (!UserPresent) {
        res.status(200).send({ msg: "User is not register yet!!" });
      }
  
      const validpassword = await bycrypt.compare(password, UserPresent.password);
  
      if (!validpassword) {
        res.send("Password is invalid");
      }
  // generate the token
      const token = jwt.sign({ "userID":UserPresent._id}, "masai",{ expiresIn: '3h' });
  
      res.status(200).send({ msg: "Login Successful", token: token });
    } catch (err) {
      res.status(404).send(err);
    }
  });
  


module.exports={userRouter}