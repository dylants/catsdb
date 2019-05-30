function getCats(req, res) {
  const cats = [
    {
      name: 'foo',
    },
    {
      name: 'bar',
    },
  ];

  res.send(cats);
}

module.exports = router => {
  router.get('/cats', getCats);
};
