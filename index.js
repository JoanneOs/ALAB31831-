//REST API:
//create folder RESTApi then: in terminal:
//npm init -y
//npm i express
//created .gitignore and put node_modules inside for now
//we will not actualy use data base for this week it will be a file called database
//good idea when connect to get hub
//npm i nodemon --save-dev
//created folder same as in sandbox, copied codes

//after that:  
// git init
// npm install
// nodemon index.js


//These can be tested directly in your browser:

// http://localhost:3000/api/users
// http://localhost:3000/api/users/1
// http://localhost:3000/api/posts
// http://localhost:3000/api/posts?userId=1


// const express = require("express");
// const bodyParser = require("body-parser");

// const users = require("./routes/users");
// const posts = require("./routes/posts");

// const error = require("./utilities/error");

// const app = express();
// const port = 3000;

// // Parsing Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({ extended: true }));

// // Logging Middlewaare
// app.use((req, res, next) => {
//   const time = new Date();

//   console.log(
//     `-----
// ${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
//   );
//   if (Object.keys(req.body).length > 0) {
//     console.log("Containing the data:");
//     console.log(`${JSON.stringify(req.body)}`);
//   }
//   next();
// });

// // Valid API Keys.
// apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// // New middleware to check for API keys!
// // Note that if the key is not verified,
// // we do not call next(); this is the end.
// // This is why we attached the /api/ prefix
// // to our routing at the beginning!
// app.use("/api", function (req, res, next) {
//   var key = req.query["api-key"];

//   // Check for the absence of a key.
//   if (!key) next(error(400, "API Key Required"));

//   // Check for key validity.
//   if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"));

//   // Valid key! Store it in req.key for route access.
//   req.key = key;
//   next();
// });

// // Use our Routes
// app.use("/api/users", users);
// app.use("/api/posts", posts);

// // Adding some HATEOAS links.
// app.get("/", (req, res) => {
//   res.json({
//     links: [
//       {
//         href: "/api",
//         rel: "api",
//         type: "GET",
//       },
//     ],
//   });
// });

// // Adding some HATEOAS links.
// app.get("/api", (req, res) => {
//   res.json({
//     links: [
//       {
//         href: "api/users",
//         rel: "users",
//         type: "GET",
//       },
//       {
//         href: "api/users",
//         rel: "users",
//         type: "POST",
//       },
//       {
//         href: "api/posts",
//         rel: "posts",
//         type: "GET",
//       },
//       {
//         href: "api/posts",
//         rel: "posts",
//         type: "POST",
//       },
//     ],
//   });
// });

// // 404 Middleware
// app.use((req, res, next) => {
//   next(error(404, "Resource Not Found"));
// });

// // Error-handling middleware.
// // Any call to next() that includes an
// // Error() will skip regular middleware and
// // only be processed by error-handling middleware.
// // This changes our error handling throughout the application,
// // but allows us to change the processing of ALL errors
// // at once in a single location, which is important for
// // scalability and maintainability.
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.json({ error: err.message });
// });

// app.listen(port, () => {
//   console.log(`Server listening on port: ${port}.`);
// });

const express = require("express");
const bodyParser = require("body-parser");

const users = require("./routes/users");
const posts = require("./routes/posts");
//adding comments rout here
const comments = require("./routes/comments"); // NEW

const error = require("./utilities/error");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// Enhanced Logging Middleware
app.use((req, res, next) => {
  const time = new Date();
  console.log(`-----
${time.toLocaleTimeString()}: Received ${req.method} request to ${req.url}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request body:", req.body);
  }
  next();
});

// Routes (no API key protection)
app.use("/api/users", users);
app.use("/api/posts", posts);
//adding comments 
app.use("/api/comments", comments); 

// HATEOAS Links
app.get("/", (req, res) => {
  res.json({
    links: [
      {
        href: "/api",
        rel: "api",
        type: "GET",
      },
    ],
  });
});

app.get("/api", (req, res) => {
  res.json({
    links: [
      {
        href: "api/users",
        rel: "users",
        type: "GET",
      },
      {
        href: "api/users",
        rel: "users",
        type: "POST",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "GET",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "POST",
      },
      {
        href: "api/comments", // NEW
        rel: "comments",
        type: "GET",
      },
      {
        href: "api/comments", // NEW
        rel: "comments",
        type: "POST",
      },
    ],
  });
});

// Error Handling
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("Available endpoints:");
  console.log(`- GET /`);
  console.log(`- GET /api`);
  console.log(`- GET /api/users`);
  console.log(`- GET /api/posts`);
  //addign comments here
  console.log(`- GET /api/comments`); //comments endpoint

});

// Part 1: Exploring Existing Routes
// Basic Checks:

// GET http://localhost:3000/
// GET http://localhost:3000/api
// User Routes:

// GET http://localhost:3000/api/users
// POST http://localhost:3000/api/users (with JSON body)
// GET http://localhost:3000/api/users/1
// PATCH http://localhost:3000/api/users/1 (with JSON body)
// DELETE http://localhost:3000/api/users/1
// Post Routes:

// GET http://localhost:3000/api/posts
// GET http://localhost:3000/api/posts?userId=1
// POST http://localhost:3000/api/posts (with JSON body)
// GET http://localhost:3000/api/posts/1
// PATCH http://localhost:3000/api/posts/1 (with JSON body)
// DELETE http://localhost:3000/api/posts/1


// Part 2: Adding Additional Routes
// Create data/comments.js:
//then routes/comments.js:


// Testing the New Endpoints:

// User Posts:
// bash
// Copy
// curl http://localhost:3000/api/users/1/posts
// User Comments:
// bash
// Copy
// curl http://localhost:3000/api/users/1/comments
// curl http://localhost:3000/api/users/1/comments?postId=1
// Post Comments:
// bash
// Copy
// curl http://localhost:3000/api/posts/1/comments
// curl http://localhost:3000/api/posts/1/comments?userId=1
// Filtered Posts:
// bash
// Copy
// curl http://localhost:3000/api/posts?userId=1
