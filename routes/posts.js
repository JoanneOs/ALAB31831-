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
const comments = require("../data/comments"); // Need comments for post's comments endpoint
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    let results = [...posts];
    
    // NEW: Filter by userId if query parameter exists
    if (req.query.userId) {
      results = results.filter(p => p.userId == req.query.userId);
    }
    
    const links = [
      {
        href: "posts/:id",
        rel: ":id",
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
  })
  .post((req, res, next) => {
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

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
      {
        href: `/${req.params.id}/comments`,
        rel: "post_comments",
        type: "GET",
      }
    ];

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
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
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

// NEW ROUTE: Get all comments for a specific post (with optional userId filter)
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
    {
      href: `/users/${req.query.userId || ''}`,
      rel: "user",
      type: "GET"
    }
  ].filter(link => !link.href.endsWith('/')); // Remove empty user link if no userId
  
  res.json({ comments: postComments, links });
});

module.exports = router;