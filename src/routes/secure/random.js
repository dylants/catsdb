const _ = require('lodash');

const models = require('../../models');

function getRandomCat(req, res) {
  models.Cat.findAll()
    .then(_.sample)
    .then(_.partialRight(_.pick, ['imageUrl', 'name', 'breed']))
    .then(cats => res.send(cats));
}

module.exports = router => {
  router.get('/random-cat', getRandomCat);
};
