
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

/*
 |--------------------------------------------------------------------------
 | Log in
 |--------------------------------------------------------------------------
 */
router.get('/auth/login/:userId', function(req, res) {
  db.User.findOne({ facebook_key: req.params.userId }, function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Invalid facebook id' });
    }else{
      res.send({ token: createJWT(user) });
    }
  });
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


/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}
