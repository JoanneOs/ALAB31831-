// Part 2: Adding Additional Routes
// Create data/comments.js:

module.exports = [
    /* 
      Basic comment structure:
      - id: Unique identifier
      - userId: Who wrote the comment
      - postId: Which post it belongs to  
      - body: The actual comment text
    */
    { id: 1, userId: 1, postId: 1, body: "First comment!" },
    { id: 2, userId: 2, postId: 1, body: "Nice post!" },
    { id: 3, userId: 1, postId: 2, body: "Interesting thoughts" }
  ];