const logger = require('../lib/logger');
const models = require('../models');
const { validateRequiredFields } = require('../lib/validator');

function register(req, res) {
  const requiredFieldError = validateRequiredFields(req.body, [
    'username',
    'password',
  ]);
  if (requiredFieldError) {
    return res.status(400).send({
      error: requiredFieldError,
    });
  }

  const { password, username } = req.body;
  if (!password.length || password.length < 8) {
    return res.status(400).send({
      error: 'password must be 8 characters or more',
    });
  }

  return models.User.create({ username, password })
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
  router.post('/register', register);
};
