// const express = require("express");
// const router = express.Router();

// const posts = require("../data/posts");
// const error = require("../utilities/error");

// router
//   .route("/")
//   .get((req, res) => {
//     const links = [
//       {
//         href: "posts/:id",
//         rel: ":id",
//         type: "GET",
//       },
//     ];

//     res.json({ posts, links });
//   })
//   .post((req, res, next) => {
//     if (req.body.userId && req.body.title && req.body.content) {
//       const post = {
//         id: posts[posts.length - 1].id + 1,
//         userId: req.body.userId,
//         title: req.body.title,
//         content: req.body.content,
//       };

//       posts.push(post);
//       res.json(posts[posts.length - 1]);
//     } else next(error(400, "Insufficient Data"));
//   });

// router
//   .route("/:id")
//   .get((req, res, next) => {
//     const post = posts.find((p) => p.id == req.params.id);

//     const links = [
//       {
//         href: `/${req.params.id}`,
//         rel: "",
//         type: "PATCH",
//       },
//       {
//         href: `/${req.params.id}`,
//         rel: "",
//         type: "DELETE",
//       },
//     ];

//     if (post) res.json({ post, links });
//     else next();
//   })
//   .patch((req, res, next) => {
//     const post = posts.find((p, i) => {
//       if (p.id == req.params.id) {
//         for (const key in req.body) {
//           posts[i][key] = req.body[key];
//         }
//         return true;
//       }
//     });

//     if (post) res.json(post);
//     else next();
//   })
//   .delete((req, res, next) => {
//     const post = posts.find((p, i) => {
//       if (p.id == req.params.id) {
//         posts.splice(i, 1);
//         return true;
//       }
//     });

//     if (post) res.json(post);
//     else next();
//   });

// module.exports = router;
const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const comments = require("../data/comments");
const users = require("../data/users");
const error = require("../utilities/error");

// GET /posts - Get all posts (with optional userId filtering)
router.get("/", (req, res) => {
  let results = [...posts];
  
  // Filter by userId if query parameter exists
  if (req.query.userId) {
    results = results.filter(p => p.userId == req.query.userId);
  }
  
  const links = [
    {
      href: "posts/:id",
      rel: "post",
      type: "GET"
    },
    {
      href: "posts/:id/comments",
      rel: "post_comments", 
      type: "GET"
    }
  ];
  
  // Include filter metadata in response
  const meta = req.query.userId 
    ? { filteredBy: { userId: req.query.userId } }
    : {};
  
  res.json({ posts: results, links, meta });
});

// POST /posts - Create new post
router.post("/", (req, res, next) => {
  if (req.body.userId && req.body.title && req.body.content) {
    // Validate user exists
    if (!users.some(u => u.id == req.body.userId)) {
      return next(error(400, "User not found"));
    }

    const newPost = {
      id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
      createdAt: new Date().toISOString()
    };

    posts.push(newPost);
    res.status(201).json(newPost);
  } else {
    next(error(400, "Missing required fields (userId, title, content)"));
  }
});

// GET /posts/:id - Get single post
router.get("/:id", (req, res, next) => {
  const post = posts.find(p => p.id == req.params.id);

  const links = [
    {
      href: `/${req.params.id}`,
      rel: "self",
      type: "PATCH"
    },
    {
      href: `/${req.params.id}`,
      rel: "self",
      type: "DELETE"
    },
    {
      href: `/${req.params.id}/comments`,
      rel: "comments",
      type: "GET"
    }
  ];

  if (post) {
    res.json({ post, links });
  } else {
    next(error(404, "Post not found"));
  }
});

// PATCH /posts/:id - Update post
router.patch("/:id", (req, res, next) => {
  const postIndex = posts.findIndex(p => p.id == req.params.id);
  
  if (postIndex === -1) {
    return next(error(404, "Post not found"));
  }

  // Only update provided fields
  posts[postIndex] = {
    ...posts[postIndex],
    ...req.body,
    updatedAt: new Date().toISOString() // Track when post was updated
  };

  res.json(posts[postIndex]);
});

// DELETE /posts/:id - Delete post
router.delete("/:id", (req, res, next) => {
  const postIndex = posts.findIndex(p => p.id == req.params.id);
  
  if (postIndex === -1) {
    return next(error(404, "Post not found"));
  }

  const deletedPost = posts.splice(postIndex, 1)[0];
  
  // Also delete associated comments
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].postId == req.params.id) {
      comments.splice(i, 1);
    }
  }

  res.json(deletedPost);
});

// GET /posts/:id/comments - Get all comments for a specific post
router.get("/:id/comments", (req, res, next) => {
  const post = posts.find(p => p.id == req.params.id);
  
  if (!post) {
    return next(error(404, "Post not found"));
  }
  
  let postComments = comments.filter(c => c.postId == req.params.id);
  
  // Optional filtering by userId
  if (req.query.userId) {
    postComments = postComments.filter(c => c.userId == req.query.userId);
  }
  
  const links = [
    {
      href: `/posts/${req.params.id}`,
      rel: "post",
      type: "GET"
    },
    req.query.userId ? {
      href: `/users/${req.query.userId}`,
      rel: "author",
      type: "GET"
    } : null
  ].filter(Boolean); // Remove null entries
  
  res.json({ 
    comments: postComments,
    count: postComments.length,
    links
  });
});

module.exports = router;