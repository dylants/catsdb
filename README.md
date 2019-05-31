# catsdb

All about registering cats. And logging them in. And then for fun, search and random. Cause, well, I guess why not?

## Getting Started

Install Node (I recommend using [nvm](https://github.com/creationix/nvm)) and [yarn](https://yarnpkg.com). Specific versions of Node and Yarn are required, and can be found in the `package.json` file.

Install the dependencies:

```
$ yarn
```

This app requires a running instance of mysql. To seed the database, run the following command:

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
