# catsdb

Example app that involves a cat registry.

Cause, coding exercises.

## Overview

This application consists of a MySQL database which hosts two things: `User`s and `Cat`s. There is then a set of APIs which allow you to create and query the database in a specific way. Below is a description of the APIs available.

The following APIs are unsecure:

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

_Optional:_ This app requires a running instance of mysql. To setup and seed the database, run the following command (which assumes username `root` and prompts for the password):

```
$ yarn db:seed
```

To start the application, run the following command:

```
$ yarn start
```

## Tests

Tests are written along side the source files, and include `.test.` in the file name. To execute the tests, run the following command:

```
$ yarn test
```

To run the tests in watch mode:

```
$ yarn test:watch
```
