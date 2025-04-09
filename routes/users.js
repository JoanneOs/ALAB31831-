const express = require("express");
const router = express.Router();

const users = require("../data/users");

const posts = require("../data/posts"); // Need posts for user's posts endpoint
const comments = require("../data/comments"); // Need comments for user's comments endpoint

const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "users/:id",
        rel: ":id",
        type: "GET",
      },
      {
        href: "users/:id/posts",
        rel: "user_posts",
        type: "GET",
      },
      {
        href: "users/:id/comments",
        rel: "user_comments",
        type: "GET",
      }
    ];

    res.json({ users, links });
  })
//   .post((req, res, next) => {
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

// module.exports = router;
.post((req, res, next) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        next(error(409, "Username Already Taken"));
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);

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
        href: `/${req.params.id}/posts`,
        rel: "user_posts",
        type: "GET",
      },
      {
        href: `/${req.params.id}/comments`,
        rel: "user_comments",
        type: "GET",
      }
    ];

    if (user) res.json({ user, links });
    else next();
  })
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  });

// NEW ROUTE: Get all posts by a specific user
router.get("/:id/posts", (req, res, next) => {
  const user = users.find(u => u.id == req.params.id);
  
  if (!user) {
    return next(error(404, "User not found"));
  }
  
  const userPosts = posts.filter(p => p.userId == req.params.id);
  
  const links = [
    {
      href: `/users/${req.params.id}`,
      rel: "user",
      type: "GET"
    }
  ];
  
  res.json({ posts: userPosts, links });
});

// NEW ROUTE: Get all comments by a specific user (with optional postId filter)
router.get("/:id/comments", (req, res, next) => {
  const user = users.find(u => u.id == req.params.id);
  
  if (!user) {
    return next(error(404, "User not found"));
  }
  
  let userComments = comments.filter(c => c.userId == req.params.id);
  
  // Optional filtering by postId
  if (req.query.postId) {
    userComments = userComments.filter(c => c.postId == req.query.postId);
  }
  
  const links = [
    {
      href: `/users/${req.params.id}`,
      rel: "user",
      type: "GET"
    },
    {
      href: `/posts/${req.query.postId || ''}`,
      rel: "post",
      type: "GET"
    }
  ].filter(link => !link.href.endsWith('/')); // Remove empty post link if no postId
  
  res.json({ comments: userComments, links });
});

module.exports = router;