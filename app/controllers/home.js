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

router.post('/login', function(req, res){

});

router.get('/users/:userId', function (req, res, next) {
  db.User.findAll({
    where: {
      id: req.params.userId
    }
  }).then(function (user){
      res.json({ user });
  })
});
