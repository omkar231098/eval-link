const express = require("express");
const { PostModel } = require("../Model/post.model");
PostRouter = express.Router();
const jwt = require("jsonwebtoken");
const { authenticate } = require("../middlewares/authenticator");

// to add the post if user is login
PostRouter.post("/add", authenticate, async (req, res) => {
    const payload = req.body;
  
    try {
      const product = new PostModel(payload);
      await product.save();
      res.status(200).send({ msg: "New Post has been Added in Database" });
    } catch (err) {
      res.status(404).send({ msg: "Not able to add Post" });
    }
  });



// This will show the posts of logged in users.

  PostRouter.get("/", authenticate,async (req, res) => {
   
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "masai");
    try {
      const product = await PostModel.find({userID:decoded.userID});
      res.status(200).send(product);
    } catch (err) {
      res.status(404).send({ msg: "Not able to read" });
    }
  });


// patch routes to update the post
PostRouter.patch("/update/:userid",authenticate, async (req, res) => {
    const { userid } = req.params;
    const payload = req.body;
    try {
      await PostModel.findByIdAndUpdate({ _id: userid }, payload);
      res.status(200).send("Post has been updated");
    } catch (err) {
      res.status(404).send({ msg: "Not able to update" });
    }
  });




  PostRouter.delete("/delete/:userid",authenticate, async (req, res) => {
    const { userid } = req.params;
  
    try {
      await PostModel.findByIdAndDelete({ _id: userid });
      res.status(200).send("Post has been deleted");
    } catch (err) {
      res.status(404).send({ msg: "Not able to delete" });
    }
  });

//   /posts pagination

PostRouter.get("/page/:pageNum",authenticate, async (req, res) => {
    const PAGE_SIZE = 3;
  
    const { pageNum } = req.params
  
    try {
      const movie = await PostModel.find({})
        .skip((pageNum - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);
      res.status(200).send(movie);
    } catch (err) {}
  });
  
// to find top post

  PostRouter.get("/top", authenticate,async (req, res) => {
   
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "masai");
    try {
      const product = await PostModel.find({userID:decoded.userID}).sort({"no_of_comments":-1}).limit(1);
      res.status(200).send(product);
    } catch (err) {
      res.status(404).send({ msg: "Not able to read" });
    }
  });


// pagination for /top router
PostRouter.get("/top/page/:pageNum",authenticate, async (req, res) => {
    const PAGE_SIZE = 3;
  
    const { pageNum } = req.params
  
    try {
      const movie = await PostModel.find({})
        .skip((pageNum - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);
      res.status(200).send(movie);
    } catch (err) {}
  });



  module.exports={PostRouter}