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