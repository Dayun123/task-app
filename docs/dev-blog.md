# Dev Blog

## 12-30-2019

#### Project Outline

I'm excited about starting this project, as it will give me a chance to practice most of the things I have learned about backend development up to this point. Here is the list from the README of the stuff I want to hit:

- CRUD operations
- User authentication
- Modeling data with Mongoose
- Basic search functionality
- Handling file uploads
- Testing routes with Postman
- Error handling

I'll go into detail on my plans below, and I'm sure I'll refine my thinking on the project as it takes shape.

#### CRUD Operations

I've made a few apps now that perform CRUD operations on resources, so this should be easy to implement. I may get lazy at some point and not even implement all of the operations for users and tasks, as that is not the primary focus of the app.

#### User Authentication

I've done API authentication using an API Key before, but this app will use JWT authentication in place of this. I will also be storing the passwords in their hashed forms using bcrypt, which is a much better security practice than what I have been doing up to this point, which is storing passwords in plaintext. Since I'm going to auto-generate a bunch of users upon installation of the project, I will probably make them all have the same password for ease of testing.

#### Modeling Data With Mongoose

I'm getting fairly comfortable with how Mongoose works, and this app will give me a chance to kick the tires on the library a little further. In this app, I expect to deal with these Mongoose concepts:
  
  - Schema validations
  - Instance/static methods
  - Virtuals
  - Middleware
  - Populators

#### Basic Search Functionality

I'm going to setup an easy way to filter tasks and for the client to setup pagination. The Mead course had all of this setup on the actual Mongoose query through the populate() calls, I may just setup some filtering on the array of tasks that are returned though to keep things easier to understand for me, as the populate() functionality is still a bit of a mystery to me.

#### Handling File Uploads

This app allows users to upload a profile picture, so I want to setup handling the upload with multer and then formatting the image with sharp. The image will be stored directly on the user object as binary Buffer data, so storing and retreiving this image will be a focus.

#### Testing Routes With Postman

I did this with the last project, and now I can't live without testing. The Mead tutorial is going to go into testing with Jest, but that's not for another 2 sections, and I am trying to do a major project every few sections so I learn the material, so I'm just going to stick with Postman tests for this project and save testing with Jest for the final project of this section of the course.

#### Error Handling

I've been using error handling for all projects, and in this one I hope to get a little better about encapsulating common error-handling logic in route or app level error handling middleware instead of having error responses being thrown from each individual route. I'm still not going to be super thorough here, but I do want to always focus on handling some common issues even in these 'toy' apps.

#### User Creation

A general pattern I seem to be following for creating a new user is to setup a static User.create method which looks something like the following:

```javascript

userSchema.statics.create = async function(newUser) {
  const user = new this(newUser);
  user.password = await bcrypt.hash(user.password, 8);
  user.generateAuthToken();
  await user.save();
  return user;
};

```

That seems to take care of the basic functions associated with user creation. Namely, creating the user model, hashing the password, setting JWT, and saving the user to the db. 

Then, in the route-handler, I don't have to worry about any of that stuff, I simply return the user profile (a virtual property that returns only the paths I want made public):

```javascript

router.post('/', async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ user: user.profile });
});

```

I like this pattern a lot. Of course, once error-handling is added, the code becomes a little muddier, but the basic separation of concerns, where the User model or class handles all User-related activities, and the route-handler simply deals with returning responses, is a nice one I think.

#### Possible Error-Handling Solution

I think I may have a solution for how to handle errors. I created a simple constructor function `ResponseError`:

```javascript

module.exports = function(status, message) {
  this.status = status;
  this.message = message;
  return this;
};

```

And then in any middleware, route-handlers, or mongoose models I can simply throw an instance of the `ResponseError` (as done here in validateContentType middleware):

```javascript

const ResponseError = require('../utils/responseError');

module.exports = (req, res, next) => {
  if (req.get('Content-Type') !== 'application/json') {
    throw new ResponseError(415, 'To create a user, the request body must have the `Content-Type: application/json` header');
  }
  next();
};

```

Then, I can have a router-level error-handling middelware as a catch-all to sniff the error object for a status, and determine which status and messsage to send:

```javascript

router.use((err, req, res, next) => {
  if (isNaN(err.status)) return res.status(500).json(err.message);
  res.status(err.status).json({ msg: err.message });
});

```

This way, hopefully, my route-handlers will just deal with calling resource-related methods and sending the success responses, and error-responses can be thrown to the catch-all error handler middleware.

#### User Validations

I'm finding that validations are a pain, but neccessary. There is so much to test for, it takes up a lot of development time. It does make me think harder about the User model, and about the incoming requests, which is nice. I'm finding that I can't rely on letting validators run at the user.save() call, but instead have to run them manually with user.validate(). This is because I'm using properties of the user instance before saving the user, so I need to be sure that they are valid.

## 12-31-2019

#### Config Files

When using JWT, in order to sign and verify the tokens you have to provide a secret. I've been just using the string 'secret' for simplicity, as I'm not focusing on security issues just yet, but it seemed easy enough to add an extra level of security by using a long, random string. Today, I had to use the secret in another file (auth.js), so I decided to create a config.json file to store the secret, then have a helper function loadConfig.js that will pull in the config file to expose the secret within the app. Once I get around to creating the install script for the app, I will include the generation of a secret and the config.json file in that script as part of the inintial app setup. Eventually, I will be using environment variables for this stuff, but I haven't learned that yet. The best I can do right now is add the config.json to the .gitignore so that it doesn't get committed to version control.

#### Storing Authenticated User

In the Mead app, we stored the authenticated user on `req.user`. While there is no problem with that approach, I'm going to store the user at `res.locals.user` so the user object will be available to views. Even though this project is not using a front-end, it seems logical to have it setup for integration at a later time with views.

#### Using next(e) In Middleware

In the auth middleware, I wanted to throw a ResponseError if something went wrong, and I thought it would be picked up by the router-level error-handling middleware. This is not the case, you have to wrap any error code in a try..catch then pass the error to next(e), like so:

```javascript

module.exports = async (req, res, next) => {
  try {
    const config = await loadConfig();
    if (!req.get('Authorization')) throw new ResponeError(401, 'Must include a valid JWT');
    const token = req.get('Authorization').replace('Bearer ', '');
    const _id = jwt.verify(token, config.secret)._id;
    const user = await User.findById(_id);
    res.locals.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

```

Then, in the route-handler itself, as long as there is no async code running, you don't need a try..catch. I'm going to always use this pattern in validation middleware going forward, even if the actual route-handler has to use try..catch logic.

#### Handling Errors Thrown By Third-Party Methods

I just ran into an issue where the `jwt.verify` method throws it's own error when the token and secret don't match up. Since I already had this wrapped in a try...catch with a few other operations that could possibly throw errors, I had to change the `e` argument in the catch() handler to be an instance of my `ResponseError` object before passing it to next(e):

```javascript

module.exports = async (req, res, next) => {
  try {
    const config = await loadConfig();
    if (!req.get('Authorization')) throw new ResponseError(401, 'Must include a JWT in an Authorization header');
    const token = req.get('Authorization').replace('Bearer ', '');
    const _id = jwt.verify(token, config.secret)._id;
    const user = await User.findById(_id);
    res.locals.user = user;
    next();
  } catch (e) {
    if (e.message.includes('invalid signature')) {
      e = new ResponseError(401, 'Must include a valid JWT');
    }
    next(e);
  }
};

```

This is a little annoying. I don't like having to sniff the error message in the catch handler and then throw my own error from there, but I don't see a better way. I definitely don't want to nest try...catch calls within one another, or have multiple try...catches in a function. Error handling is tedious!

#### Development Workflow

I'm still refining how I approach developing a web app, but here is my current workflow:

1. Decide on a route to implement
2. Create a git branch for that route (such as get-users for GET /users)
3. Create a Postman request for the route and any associated tests for a successful response.
4. Run the Postman request, watch it fail.
5. Create a route-handler for the request, send back a correct 'dummy' response.
6. Implement any logic to create a real response
(loop this part until through)
  7. Create invalid Postman requests and associated tests
  8. Setup error-handling to response correctly for each invalid request

That whole workflow makes logical sense to me. I'm thinking of it as route-based development workflow. When I was working yesterday, starting from a clean app, I began with the POST /user route, to create a user. Once I got the Postman request hooked up and the express route-handler returning a dummy response, I had a bunch of work to do hooking up the database, creating a Mongoose Schema and Model for a User, deciding on how to struture error-handling, etc... So what begins with a simple desire to fill out a route can bounce around through many different paths to get the task completed, but at the end, what has been accomplished is simply implemting the route. I imagine I will keep this workflow even once the front-end is hooked up, it will just fit in wherever it goes logically in the process.