const logger = require('../lib/logger');
const models = require('../models');

function checkRequired(req, res) {
  return field => {
    if (!req.body[field]) {
      return res.status(400).send({
        error: `${field} is required`,
      });
    }
    return null;
  };
}

// TODO This function does it's job, but could probably
// be refactored to improve the logic flow
function validateInput(req, res) {
  const checkFieldExists = checkRequired(req, res);

  checkFieldExists('name');
  checkFieldExists('username');
  checkFieldExists('password');
  checkFieldExists('weight');

  const { password } = req.body;

  if (!password.length || password.length < 8) {
    return res.status(400).send({
      error: 'password must be 8 characters or more',
    });
  }

  return null;
}

function register(req, res) {
  validateInput(req, res);

  const {
    birthdate,
    breed,
    imageUrl,
    name,
    password,
    username,
    weight,
  } = req.body;

  return models.Cat.create({
    birthdate,
    breed,
    imageUrl,
    name,
    password,
    username,
    weight,
  })
    .then(() => res.status(204).end())
    .catch(err => {
      logger.error({ err });

      // in this case, we assume the username is invalid since it must be unique
      if (err && err.name && err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send({
          error: 'username must be unique',
        });
      }

      // at this point I guess it's our fault, so say it is so
      return res.status(500).send({
        error: 'Server error',
      });
    });
}

module.exports = router => {
  router.post('/cat/register', register);
};
