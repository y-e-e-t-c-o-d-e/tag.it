# tag.it
[![Build Status](https://travis-ci.com/daniel-d-truong/tag.it.svg?token=v6x1vg9EP5hEQK1JSXxA&branch=master)](https://travis-ci.com/daniel-d-truong/tag.it)

## About

tag.it is an innovative platform that connects students to teachers. This GitHub Respository contains all the source code to run the application.

All Code is seperated into [`backend`](https://github.com/daniel-d-truong/tag.it/tree/master/backend) and [`client`](https://github.com/daniel-d-truong/tag.it/tree/master/client) code, in each their own respective folder.

The backend is written in [Express.js](https://expressjs.com) and the frontend is written in [React](https://reactjs.org). We use [Firebase](https://firebase.google.com) as the database. For testing, we leverage the [Mocha](https://mochajs.org) and [Chai](https://chaijs.org) frameworks.

We have deployed the production version of tag.it using [Netlify](https://netlify.com) to run the static frontend and [Heroku](https://heroku.com) to host the backend api server.

You can checkout the live version of the app @ [tagdotit.netlify.app](https://tagdotit.netlify.app)


## Developing the App Locally

### Installation

```
git clone https://github.com/daniel-d-truong/tag.it
yarn install
```

### Front-End / Back-End Localhosts
Frontend runs on localhost:3000.  
Backend runs on localhost:4000 (to access API routes, use localhost:4000/api/).

### Running the Whole Webapp
```
yarn start
```
This commands runs the frontend AND the backend. 

### Running the Whole Test Suite
```
yarn test
```
This command runs the tests in the frontend AND the backend.

### Running the Front End
```
yarn client
```
This command runs the frontend ONLY.

### Running the Back End
```
yarn server
```
This command runs the backend ONLY.
