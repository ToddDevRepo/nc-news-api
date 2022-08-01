# Northcoders News API

## Setup

To connect to your own database, you will need to add your own .env files - one for the development database and one for the test database. Add the following files to the project root folder:

.env.test
.env.development

Use these files to configure your database environment.

For instance, to set the database name, in the .env.development file, add the line:
PGDATABASE=<name of your development database>

In your .env.test file, add the line:
PGDATABASE=<name of your test database>
