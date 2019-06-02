const logger = require('../lib/logger');
const models = require('../models');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { validatePassword } = require('../lib/auth');
const { validateRequiredFields } = require('../lib/validator');

const LOGIN_FAILED_ERROR = 'username or password is invalid';

function login(req, res) {
  const requiredFieldError = validateRequiredFields(req.body, [
    'username',
    'password',
  ]);
  if (requiredFieldError) {
    return res.status(400).send({
      error: requiredFieldError,
    });
  }

  const { username, password } = req.body;

  return models.User.findOne({ where: { username } })
    .then(user => {
      if (!user) {
        throw new UnauthorizedError();
      }

      return validatePassword(password, user.password);
    })
    .then(valid => {
      if (!valid) {
        throw new UnauthorizedError();
      }

      return res.status(201).end();
    })
    .catch(err => {
      logger.error({ err });

      if (err instanceof UnauthorizedError) {
        return res.status(401).send({ error: LOGIN_FAILED_ERROR });
      }

      return res.status(500).send({
        error: 'Server error',
      });
    });
}

module.exports = router => {
  router.post('/login', login);
};
