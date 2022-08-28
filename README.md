# Northcoders News API

## Summary

Back-end for the sample Northcoders News aggregation, web content rating, and discussion website. You can find a working version of the whole application here:

https://fe-nc-news-app.herokuapp.com/

## Hosted backend

You can find a live version of the application backend here:

https://nc-news-api-live.herokuapp.com/api

## Pre-requisites:

- Node.js v18.4.0 or higher.
- Postgresqul version 12.11 or higher.
- Git installed on your computer.

## Setup

### Cloning

You can find the project at the following link:

https://github.com/ToddDevRepo/nc-news-api

To clone the project:

1. Use your command line to navigate to the directory in which you wish to clone the project.

2) Go to the above backend GitHub repository and fork a copy of the project.
3) On your forked copy, click Code and copy the http clone link

4. Clone the repository by typing:

$ git clone <your clone link>

### Install Dependencies

Once you have cloned the project, you should use the Node Package Manager to install the project dependencies. Type:

$ npm install

### Connect to your Local Postgres Database

To connect to your own database, you will need to add your own .env files - one for the development database and one for the test database. Add the following files to the project root folder:

.env.test

.env.development

Use these files to configure your database environment.

So, to set the database name, in the .env.development file, add the line:

PGDATABASE=nc_news

In your .env.test file, add the line:

PGDATABASE=nc_news_test

### Create and Seed the Database

Before attempting to create your databases, ensure Postgres is running.

You can create your local development and test databases by entering the command:

$ npm run setup-dbs

To seed your development database, type:

$ npm run seed

The test database will be automatically seeded when you run your tests. To run the test suite, type:

$ npm test

## API Functions

To view a description of the different api functions, goto the api endpoints root at:
https://nc-news-api-live.herokuapp.com/api
