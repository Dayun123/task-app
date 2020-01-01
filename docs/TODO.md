# TODO

## Setup Populate DB

I need to create a script that populates the DB with some stock users and tasks.

## Figure Out How To Test GET /tasks?query Routes

I'm not sure how to test the routes that add search filters to the tasks returned at `GET /tasks` in a way that will be robust. I know how to test the routes given a user that I've already created and added some tasks too, but for the stock app on first install I'm not sure of the best way to go about testing the routes. I'm thinking I will have a pre-request script on them that creates a user and some stock complete/incomplete tasks, then stores these in some sort of environment variable to pull from for the post-request tests. Seems like it's going to be quite a headache to setup though.