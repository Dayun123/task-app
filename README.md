# Task App

A simple implementation of a task manager app, allowing users to perform basic CRUD operations on a set of tasks.

## Project Goals

This project will allow me to practice some techniques I picked up from Andrew Mead's [The Complete Node.js Developer Course](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) Udemy tutorial series, as well as a few other sources.

I'm working through the following concepts in this project:

- CRUD operations
- User authentication
- Modeling data with Mongoose
- Basic search functionality
- File uploads
- Postman Tests

I will be blogging as I work through creating this app and committing the file to the repo. It can be viewed at [Dev Blog](https://github.com/Dayun123/task-app/blob/master/docs/dev-blog.md).

In addition to the dev blog, I have a document that will track my TODO's for the project at [TODO](https://github.com/Dayun123/task-app/blob/master/docs/TODO.md).

## Caveats

As I'm trying to understand the Express framework and Node.js at a very basic level, I will *NOT* have any client-side code, this project will just provide the backend for a task app. I'm also not creating a production environment, everything will be setup for development only as this project is not going to be deployed.

## Installation

Clone the repo and run `npm install`:

```bash
$ git clone git@github.com:Dayun123/task-app.git
$ npm install
```

Ensure you have a `mongod` instance running, and then populate the db with some stock users and tasks (you must enter a database name in place of `{dbName}`):

```bash
$ npm run db {dbName}
```

If you need to destroy all the db data for some reason, a convenience script has been provided to do so:

```bash
$ npm run flush-db
```

## Usage

Start the server:

```bash
$ DEBUG=task-app:* npm run dev
```

All requests can then be made to the base url: `http://localhost:3000`

## Postman Tests

The app comes bundled with a file at `tests/task-app.postman_collection.json` that has mock requests and tests to ensure everything is hooked-up correctly after installation. You will need to import this collection into Postman, and then run all the tests in the Postman Collection Runner to ensure that the app is functioning correctly.

## Authorization

JWT authentication is used to ensure that `users` only have access to their own account. The only routes not behind an authentication firewall are the routes to create a user and login.

## Routes

Accepts requests at the following routes:

*All routes except `POST /user`, `GET /login`, and `GET /user/:id/avatar` can only be accessed with a valid JWT token for a valid `user` account*

#### Task Routes

|  Method | Path       | Description           |
| --------| -----------| ----------------------|
| GET     | /tasks     | Return all tasks      |
| GET     | /tasks/:id | Return task with `id` |
| POST    | /tasks     | Create task           |
| PATCH   | /tasks/:id | Update task with `id` |
| DELETE  | /tasks/:id | Delete task with `id` |

#### User Routes

|  Method | Path  | Description   |
| --------| ------| --------------|
| GET     | /user | Return user   |
| POST    | /user | Create user   |
| PATCH   | /user | Update user   |
| DELETE  | /user | Delete user   |

#### Avatar Routes

|  Method | Path             | Description   |
| --------| -----------------| --------------|
| POST    | /user/avatar     | Upload avatar |
| GET     | /user/:id/avatar | Return avatar |

#### Login/Logout Routes

|  Method | Path       | Description                  |
| --------| -----------| -----------------------------|
| GET     | /login     | Login user                   |
| GET     | /logout    | Logout user                  |
| GET     | /logoutAll | Logout user from all devices |

## Search

Search functionality is provided to filter through tasks. To search for a task, the following queries are available at the route `GET /tasks`:

Pagination helpers:

- numResults
- page

Sorting:

- completed

#### Example Search Requests

Get the first 4 tasks for a user:

`GET http://localhost:3000/tasks?numResults=4`

Get the second page of incompleted tasks for a user (assuming there are more than 5 tasks that are incomplete): 

`GET http://localhost:3000/tasks?numResults=5&page=2&completed=false`

## Response Format

### Success

Successful responses return a single resource, an array of resources, or a JSON object with `statusCode`, `statusMessage`, and `user` properties (`user` is used for example, `task` is also valid)

A request to `GET /user` would return:

```json
{
  "username": "Marion24",
  "email": "Sarai84@hotmail.com",
  "authTokens" : [
    {
      "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTBhNTc0MTRkYzMzNTE5OTkxOTc4ZGYiLCJpYXQiOjE1Nzc3MzYwMTJ9.31NS7NSLZHHxKZSv5-HjbdngMVdLkBqtemh3j-8cpzI"
    },
    {
      "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTBhNTc0MTRkYzMzNTE5OTkxOTc4ZGYiLCJpYXQiOjE1Nzc3MzYwMTN9.nztHqs9D68jHcmIHHMfNs37hwhmcaFz_GpHNyrb0pck"
    }
  ],
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTBhNTc0MTRkYzMzNTE5OTkxOTc4ZGYiLCJpYXQiOjE1Nzc3MzYwMTN9.nztHqs9D68jHcmIHHMfNs37hwhmcaFz_GpHNyrb0pck"
}
```

While a successful request to `POST /user` would return:

```json
{
  "statusCode": 201,
  "statusMessage": "User created",
  "user": {
    "username": "Marion24",
    "email": "Sarai84@hotmail.com",
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTBhNTc0MTRkYzMzNTE5OTkxOTc4ZGYiLCJpYXQiOjE1Nzc3MzYwMTN9.nztHqs9D68jHcmIHHMfNs37hwhmcaFz_GpHNyrb0pck"
  }
}
```

### Failure

Unsuccessful responses return a JSON object with `statusCode` and `statusMessage` properties detailing what went wrong.

Here is an example response for an authentication error:

```json
{
  "statusCode": 401,
  "statusMessage": "Must provide a valid JWT"
}
```

And here is an example response for a request that doesn't have the correct information for creating a new task:

```json
{
  "statusCode": 400,
  "statusMessage": "A description is required to create a task"
}
```

## Creating A Resource

To create a user, send a JSON object in the request body with the format:

```json
{
  "username": "Marion24",
  "password": "REW4fs2sVmhtcsm",
  "email": "Sarai84@hotmail.com"
}
```

To create a task, send a JSON object in the request body with the format:

```json
{
  "description": "Finish cleaning backyard"
}
```

Users require a `username`, `password`, and `email` while tasks require a `description`.

A request to create a resource should have the header `Content-Type: application/json` or it will be rejected.

## Uploading An Avatar

Users can upload an avatar at the route `POST /user/avatar`. The avatar should be an image file, it will be resized to 150/150px and converted to a png on submission. It can be accessed from the route `GET /user/:id/avatar`.