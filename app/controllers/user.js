var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  moment = require('moment'),
  jwt = require('jwt-simple'),
  sequelize = require('sequelize');

var config = require('../../config/config');

module.exports = function (app) {
  app.use('/user', router);
};

router.get('/', function (req, res, next) {
  db.Article.findAll().then(function (articles) {
    res.render('index', {
      title: 'Generator-Express MVC USER',
      articles: articles[0].title
    });
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

/*
 |--------------------------------------------------------------------------
 | Decode JSON Web Token
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization').split(' ')[0];
  var payload = null;
  try { payload = jwt.decode(token, config.TOKEN_SECRET); }
  catch (err) { return res.status(401).send({ message: err.message }); }

  if (payload.exp <= moment().unix()) {
     return res.status(401).send({ message: 'Token has expired' });
  }
  req.user_id = payload.sub;
  next();
}

router.post('/auth/login', function(req, res){
  db.User.findOne({
    where: { facebook_key: req.body.facebook_key }
  }).then(function (user){
    if (!user) {
      return res.status(401).send({message: 'Invalid facebook id'});
    } else {
      res.json({token: createJWT(user)});
    }
  });
});

router.post('/:userId/follow', ensureAuthenticated, function(req, res) {
  Follower.findOrCreate({
    where: { follower_id: req.user_id },
    defaults: { user_id: req.params.userId }
  })
    .spread(function(user, created) {
      console.log(user.get({
        plain: true
      }));
      console.log(created);
  });
});

router.get('/get/profile', ensureAuthenticated, function(req, res){
  db.Photo.findAll({
    where: { user_id: req.user_id }
  }).then( function (photos){
    db.Follower.findAll({
      attributes: [
              [sequelize.literal('(SELECT COUNT(*) FROM "Followers" WHERE "Followers"."follower_id" = ' + req.user_id +')'), 'following'],
              [sequelize.literal('(SELECT COUNT(*) FROM "Followers" WHERE "Followers"."user_id" = '+ req.user_id +')'), 'followers']
          ],
      where: { user_id: req.user_id }
    }).then( function (profile){
      res.json({ profile: profile, photos: photos });
    });
  });
});

router.get('/search/:text', ensureAuthenticated, function(req, res, next) {
  var query = 'SELECT DISTINCT * FROM "Users" ' +
                'WHERE "Users".names ILIKE' + '%%:text%%' +
                  'OR "Users".surnames ILIKE' + '%%:text%%';

  db.sequelize.query(query, { replacements: { text: req.params.text },
                              type: db.sequelize.QueryTypes.SELECT
                            })
  .then(function(users) {
    res.json(users);
    // We don't need spread here, since only the results will be returned for select queries
  });

});
