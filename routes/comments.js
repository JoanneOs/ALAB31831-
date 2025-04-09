// routes/comments.js
const express = require("express");
const router = express.Router();
const error = require("../utilities/error");

// Import our fake "database"
const comments = require("../data/comments");
const users = require("../data/users");
const posts = require("../data/posts");

//get all comments :
router.get("/", (req, res, next) => {
    // Start with all comments
    let results = [...comments]; 
    
    // Filter magic happens here!
    // If userId query param exists, filter by it
    if (req.query.userId) {
      results = results.filter(c => c.userId == req.query.userId);
    }
     // If postId query param exists, filter by it
  if (req.query.postId) {
    results = results.filter(c => c.postId == req.query.postId);
  }

    // Return filtered results
    res.json(results);
});

