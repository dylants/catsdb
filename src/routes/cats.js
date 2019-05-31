const _ = require('lodash');

const logger = require('../lib/logger');
const models = require('../models');

function filterBy(query) {
  // grab the possible query attributes, that are defined
  const filter = _(query)
    .pick(['id', 'name', 'ownedBy'])
    .pickBy(_.identity)
    .value();

  // the id property, if it's supplied is a string. But we store it as
  // a number. So we gotta change the filter to match the data.
  if (filter.id) {
    filter.id = parseInt(filter.id, 10);
  }

  return cats => _.filter(cats, filter);
}

function sort(cats) {
  return _.orderBy(cats, ['updatedAt'], ['desc']);
}

function filterAttributes(cats) {
  return cats.map(
    _.partialRight(_.pick, [
      'birthdate',
      'breed',
      'id',
      'imageUrl',
      'name',
      'ownedBy',
    ]),
  );
}

function getCats(req, res) {
  const filter = filterBy(req.query);

  return models.Cat.findAll()
    .then(filter)
    .then(sort)
    .then(filterAttributes)
    .then(cats => res.send(cats));
}

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
  checkFieldExists('weight');

  return null;
}

function createCat(req, res) {
  validateInput(req, res);

  return models.Cat.create(req.body)
    .then(() => res.status(204).end())
    .catch(err => {
      logger.error({ err });

      // at this point I guess it's our fault, so say it is so
      return res.status(500).send({
        error: 'Server error',
      });
    });
}

module.exports = router => {
  router.get('/cats', getCats);
  router.post('/cats', createCat);
};
