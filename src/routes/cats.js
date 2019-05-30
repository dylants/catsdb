const models = require('../models');

function getCats(req, res) {
  models.Cats.findAll().then(cats => res.send(cats));
}

module.exports = router => {
  router.get('/cats', getCats);
};
