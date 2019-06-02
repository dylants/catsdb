const _ = require('lodash');

const logger = require('../../lib/logger');
const models = require('../../models');
const { validateRequiredFields } = require('../../lib/validator');

function filterBy(query) {
  // grab the possible query attributes, that are defined/non-null
  const filter = _(query)
    .pick(['id', 'name', 'ownedBy'])
    .pickBy(_.identity)
    .value();

  // the id property, if it's supplied, is a string. But we store it as
  // a number. So we gotta change the filter to match the data.
  if (filter.id) {
    filter.id = parseInt(filter.id, 10);
  }

  return cats => _.filter(cats, filter);
}

function sort(cats) {
  return _.orderBy(cats, ['updatedAt'], ['desc']);
}

function pickAttributes(cats) {
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
    .then(pickAttributes)
    .then(cats => res.send(cats));
}

function createCat(req, res) {
  const requiredFieldError = validateRequiredFields(req.body, [
    'name',
    'ownedBy',
    'weight',
  ]);
  if (requiredFieldError) {
    return res.status(400).send({
      error: requiredFieldError,
    });
  }

  return models.Cat.create(req.body)
    .then(() => res.status(204).end())
    .catch(err => {
      logger.error({ err });
      return res.status(500).send({
        error: 'Server error',
      });
    });
}

module.exports = router => {
  router.get('/cats', getCats);
  router.post('/cats', createCat);
};
