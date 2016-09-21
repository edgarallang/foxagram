
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
/*router.get('/auth/login/:userId', function(req, res) {

  db.User.findOne({ facebook_key: req.params.userId }, function(err, user) {
    if (!user) {
      res.json({token:'hola'});
      return res.status(401).send({ message: 'Invalid facebook id' });
    }else{
      user_jwt = createJWT(user);
      res.json({ token: user_jwt });
    }

  });
});*/

router.get('/auth/login/:userId', function(req, res){
  db.User.findOne({
    where: { facebook_key: req.params.userId }
  }).then(function (user){
    res.json({token: createJWT(user)});
  });

});

router.get('/users/:userId', function (req, res, next) {
  db.User.findAll({
    where: {
      id: req.params.userId
    }
  }).then(function (user){
      res.json({ user: "EdgarAllanGlez" });
  });
});


/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}
