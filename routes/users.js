// const express = require("express");
// const router = express.Router();

// const users = require("../data/users");

// const posts = require("../data/posts"); // Need posts for user's posts endpoint
// const comments = require("../data/comments"); // Need comments for user's comments endpoint

// const error = require("../utilities/error");

// router
//   .route("/")
//   .get((req, res) => {
//     const links = [
//       {
//         href: "users/:id",
//         rel: ":id",
//         type: "GET",
//       },
//       {
//         href: "users/:id/posts",
//         rel: "user_posts",
//         type: "GET",
//       },
//       {
//         href: "users/:id/comments",
//         rel: "user_comments",
//         type: "GET",
//       }
//     ];

//     res.json({ users, links });
//   })
// //   .post((req, res, next) => {
// //     if (req.body.name && req.body.username && req.body.email) {
// //       if (users.find((u) => u.username == req.body.username)) {
// //         next(error(409, "Username Already Taken"));
// //       }

// //       const user = {
// //         id: users[users.length - 1].id + 1,
// //         name: req.body.name,
// //         username: req.body.username,
// //         email: req.body.email,
// //       };

// //       users.push(user);
// //       res.json(users[users.length - 1]);
// //     } else next(error(400, "Insufficient Data"));
// //   });

// // router
// //   .route("/:id")
// //   .get((req, res, next) => {
// //     const user = users.find((u) => u.id == req.params.id);

// //     const links = [
// //       {
// //         href: `/${req.params.id}`,
// //         rel: "",
// //         type: "PATCH",
// //       },
// //       {
// //         href: `/${req.params.id}`,
// //         rel: "",
// //         type: "DELETE",
// //       },
// //     ];

// //     if (user) res.json({ user, links });
// //     else next();
// //   })
// //   .patch((req, res, next) => {
// //     const user = users.find((u, i) => {
// //       if (u.id == req.params.id) {
// //         for (const key in req.body) {
// //           users[i][key] = req.body[key];
// //         }
// //         return true;
// //       }
// //     });

// //     if (user) res.json(user);
// //     else next();
// //   })
// //   .delete((req, res, next) => {
// //     const user = users.find((u, i) => {
// //       if (u.id == req.params.id) {
// //         users.splice(i, 1);
// //         return true;
// //       }
// //     });

// //     if (user) res.json(user);
// //     else next();
// //   });

// // module.exports = router;
// .post((req, res, next) => {
//     if (req.body.name && req.body.username && req.body.email) {
//       if (users.find((u) => u.username == req.body.username)) {
//         next(error(409, "Username Already Taken"));
//       }

//       const user = {
//         id: users[users.length - 1].id + 1,
//         name: req.body.name,
//         username: req.body.username,
//         email: req.body.email,
//       };

//       users.push(user);
//       res.json(users[users.length - 1]);
//     } else next(error(400, "Insufficient Data"));
//   });

// router
//   .route("/:id")
//   .get((req, res, next) => {
//     const user = users.find((u) => u.id == req.params.id);

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
//       {
//         href: `/${req.params.id}/posts`,
//         rel: "user_posts",
//         type: "GET",
//       },
//       {
//         href: `/${req.params.id}/comments`,
//         rel: "user_comments",
//         type: "GET",
//       }
//     ];

//     if (user) res.json({ user, links });
//     else next();
//   })
//   .patch((req, res, next) => {
//     const user = users.find((u, i) => {
//       if (u.id == req.params.id) {
//         for (const key in req.body) {
//           users[i][key] = req.body[key];
//         }
//         return true;
//       }
//     });

//     if (user) res.json(user);
//     else next();
//   })
//   .delete((req, res, next) => {
//     const user = users.find((u, i) => {
//       if (u.id == req.params.id) {
//         users.splice(i, 1);
//         return true;
//       }
//     });

//     if (user) res.json(user);
//     else next();
//   });

// // NEW ROUTE: Get all posts by a specific user
// router.get("/:id/posts", (req, res, next) => {
//   const user = users.find(u => u.id == req.params.id);
  
//   if (!user) {
//     return next(error(404, "User not found"));
//   }
  
//   const userPosts = posts.filter(p => p.userId == req.params.id);
  
//   const links = [
//     {
//       href: `/users/${req.params.id}`,
//       rel: "user",
//       type: "GET"
//     }
//   ];
  
//   res.json({ posts: userPosts, links });
// });

// // NEW ROUTE: Get all comments by a specific user (with optional postId filter)
// router.get("/:id/comments", (req, res, next) => {
//   const user = users.find(u => u.id == req.params.id);
  
//   if (!user) {
//     return next(error(404, "User not found"));
//   }
  
//   let userComments = comments.filter(c => c.userId == req.params.id);
  
//   // Optional filtering by postId
//   if (req.query.postId) {
//     userComments = userComments.filter(c => c.postId == req.query.postId);
//   }
  
//   const links = [
//     {
//       href: `/users/${req.params.id}`,
//       rel: "user",
//       type: "GET"
//     },
//     {
//       href: `/posts/${req.query.postId || ''}`,
//       rel: "post",
//       type: "GET"
//     }
//   ].filter(link => !link.href.endsWith('/')); // Remove empty post link if no postId
  
//   res.json({ comments: userComments, links });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const comments = require("../data/comments"); // Needed for post comments
const error = require("../utilities/error");

// GET /posts - Get all posts (with optional filtering)
router.get("/", (req, res) => {
  let results = posts;
  
  // Filter by userId if provided
  if (req.query.userId) {
    results = results.filter(p => p.userId == req.query.userId);
  }
  
  const links = [
    {
      href: "posts/:id",
      rel: "post",
      type: "GET",
    },
    {
      href: "posts/:id/comments",
      rel: "post_comments",
      type: "GET",
    }
  ];
  
  // Include filter in response if used
  const meta = req.query.userId 
    ? { filteredBy: { userId: req.query.userId } }
    : {};
  
  res.json({ posts: results, links, meta });
});

// POST /posts - Create new post
router.post("/", (req, res, next) => {
  if (req.body.userId && req.body.title && req.body.content) {
    const post = {
      id: posts[posts.length - 1].id + 1,
      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
    };

    posts.push(post);
    res.json(posts[posts.length - 1]);
  } else next(error(400, "Insufficient Data"));
});

// GET /posts/:id - Get single post
router.get("/:id", (req, res, next) => {
  const post = posts.find((p) => p.id == req.params.id);

  const links = [
    {
      href: `/${req.params.id}`,
      rel: "self",
      type: "PATCH",
    },
    {
      href: `/${req.params.id}`,
      rel: "self",
      type: "DELETE",
    },
    {
      href: `/${req.params.id}/comments`,
      rel: "comments",
      type: "GET",
    }
  ];

  if (post) res.json({ post, links });
  else next();
});

// PATCH /posts/:id - Update post
router.patch("/:id", (req, res, next) => {
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      for (const key in req.body) {
        posts[i][key] = req.body[key];
      }
      return true;
    }
  });

  if (post) res.json(post);
  else next();
});

// DELETE /posts/:id - Delete post
router.delete("/:id", (req, res, next) => {
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      posts.splice(i, 1);
      
      // Also delete associated comments
      for (let j = comments.length - 1; j >= 0; j--) {
        if (comments[j].postId == req.params.id) {
          comments.splice(j, 1);
        }
      }
      
      return true;
    }
  });

  if (post) res.json(post);
  else next();
});

// NEW: GET /posts/:id/comments - Get all comments for post (with optional userId filter)
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
  
  res.json({ comments: postComments, links });
});

module.exports = router;