# catsdb

Register to create cats.

## Overview

This application consists of a MySQL database which hosts two things: `User`s and `Cat`s. There are a set of APIs which allow you to create and query the database in a specific way. Below is a description of the APIs available.

The following APIs are unsecure (requires no auth):

- `/register` : POST request, accepts `username` and `password` in the body of the request, and creates a `User` in the database.
- `/login` : POST request, accepts `username` and `password` in the body of the request, and returns an `authToken`.

The following APIs are secured (requires an `authToken` header):

- `/secure/cats` : GET request, lists the `Cat`s in the database. Can be filtered with "id", "name", and/or "ownedBy" in the query string.
- `/secure/cats` : POST request, creates a `Cat` in the database. The body of the request includes the attributes of the `Cat`. View the `Cat` database model for more information on the attributes.
- `/secure/random-cat` : GET request, returns a random `Cat` from the database, specifying the "imageUrl", "name", and "breed".

## Getting Started

Install Node (I recommend using [nvm](https://github.com/creationix/nvm)) and [yarn](https://yarnpkg.com). Specific versions of Node and Yarn are required, and can be found in the `package.json` file.

Install the dependencies:

```
$ yarn
```

This app requires a running instance of mysql. To setup and seed the database, a sql script has been provided. This script will recreate the `catsdb` database, create the `Users` and `Cats` tables, and seed some data in those tables. To run the script:

```
$ mysql -h <hostname> -u <mysql_user> -p < db/init.sql
```

Where `hostname` is the hostname of the mysql instance, and `mysql_user` is the mysql username to be used by the script. The script will then prompt for the password, and on validation, setup the database.

### Development

To start the application in development mode, run the following command:

```
$ yarn start
```

### Production

For production, run the following command:

```
$ DATABASE_HOSTNAME=<hostname> DATABASE_USERNAME=<username> DATABASE_PASSWORD=<password> yarn production
```

Where `hostname` is the hostname of the mysql server, `username` is the username of the mysql user, and `password` is the password of the mysql user.

The application will be accessible on port 3000 (by default).

## Configuration

Configuration for the application is available within the `config/index.js` file.

## Tests

Tests are written along side the source files, and include `.test.` in the file name. To execute the tests, run the following command:

```
$ yarn test
```

To run the tests in watch mode:

```
$ yarn test:watch
```
