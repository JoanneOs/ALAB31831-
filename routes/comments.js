// routes/comments.js
const express = require("express");
const router = express.Router();
const error = require("../utilities/error");

// Import our fake "database"
const comments = require("../data/comments");
const users = require("../data/users");
const posts = require("../data/posts");

//get all comments :
// router.get("/", (req, res, next) => {
//     // Start with all comments
//     let results = [...comments]; 
    
//     // Filter magic happens here!
//     // If userId query param exists, filter by it
//     if (req.query.userId) {
//       results = results.filter(c => c.userId == req.query.userId);
//     }
//      // If postId query param exists, filter by it
//   if (req.query.postId) {
//     results = results.filter(c => c.postId == req.query.postId);
//   }

//     // Return filtered results
//     res.json(results);
// });

router.get("/", (req, res, next) => {
    let results = comments;
    
    // Filter by userId if provided
    if (req.query.userId) {
      results = results.filter(c => c.userId == req.query.userId);
    }
    
    // Filter by postId if provided
    if (req.query.postId) {
      results = results.filter(c => c.postId == req.query.postId);
    }
    
    res.json(results);
  });
  
  // POST /comments - Create new comment
  router.post("/", (req, res, next) => {
    if (req.body.userId && req.body.postId && req.body.body) {
      // Validate user exists
      if (!users.some(u => u.id == req.body.userId)) {
        return next(error(400, "User not found"));
      }
      
      // Validate post exists
      if (!posts.some(p => p.id == req.body.postId)) {
        return next(error(400, "Post not found"));
      }
      
      const newComment = {
        id: comments.length + 1,
        userId: req.body.userId,
        postId: req.body.postId,
        body: req.body.body
      };
      
      comments.push(newComment);
      res.status(201).json(newComment);
    } else {
      next(error(400, "Missing required fields (userId, postId, body)"));
    }
  });
  
  // GET /comments/:id - Get single comment
  router.get("/:id", (req, res, next) => {
    const comment = comments.find(c => c.id == req.params.id);
    
    if (comment) {
      res.json(comment);
    } else {
      next(error(404, "Comment not found"));
    }
  });
  
  // PATCH /comments/:id - Update comment
  router.patch("/:id", (req, res, next) => {
    const comment = comments.find(c => c.id == req.params.id);
    
    if (comment) {
      // Only update the body if provided
      if (req.body.body) {
        comment.body = req.body.body;
      }
      res.json(comment);
    } else {
      next(error(404, "Comment not found"));
    }
  });
  
  // DELETE /comments/:id - Delete comment
  router.delete("/:id", (req, res, next) => {
    const index = comments.findIndex(c => c.id == req.params.id);
    
    if (index !== -1) {
      const deleted = comments.splice(index, 1);
      res.json(deleted[0]);
    } else {
      next(error(404, "Comment not found"));
    }
  });
  
  module.exports = router;