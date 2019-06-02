const logger = require('../lib/logger');
const models = require('../models');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { generateToken, validatePassword } = require('../lib/auth');
const { validateRequiredFields } = require('../lib/validator');

const LOGIN_FAILED_ERROR = 'username or password is invalid';

async function login(req, res) {
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
    .then(async user => {
      if (!user) {
        throw new UnauthorizedError();
      }

      const valid = await validatePassword(password, user.password);
      return { user, valid };
    })
    .then(({ user, valid }) => {
      if (!valid) {
        throw new UnauthorizedError();
      }

      const token = generateToken(user.username);

      return res.status(201).send({ token });
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
