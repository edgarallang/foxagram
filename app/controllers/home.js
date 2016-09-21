
var express = require('express'),
  router = express.Router(),
  db = require('../models');
  moment = require('moment');
  jwt = require('jwt-simple');


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

router.post('/auth/login', function(req, res){
  db.User.findOne({
    where: { facebook_key: req.body.facebook_key }
  }).then(function (user){
    if (!user) {
      return res.status(401).send({message: 'Invalid facebook id'})
    }else{
      res.json({token: createJWT(user)});
    }
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
  return jwt.encode(payload, 'coldnessbitch');
}
