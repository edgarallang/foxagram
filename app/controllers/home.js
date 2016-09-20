var express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  db.Article.findAll().then(function (articles) {
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles[0].title
    });
  });
});

router.get('/users/:userId', function (req, res, next) {
  db.Article.findAll().then(function (articles) {
    res.render('index', {
      title: 'Edgar Website ' + req.params.userId,
      articles: articles[0].url
    });
    //  res.json({ user: 'EdgarAllanGlez' });
  });
});
