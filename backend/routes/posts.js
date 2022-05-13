const router = require("express").Router();
const { publicPosts, privatePosts } = require("../database");
const authToken = require("../middleware/authenticateToken");


 
 

router.get("/public", (req, res) => {

// const cors = require("cors");

// app.options("*", cors());
  res.json(publicPosts);
});

router.get("/private", authToken , (req, res) => {

// const cors = require("cors");

// app.options("*", cors());
  res.json(privatePosts);
});

module.exports =router;
