
var express = require('express'),
  router = express.Router(),
  db = require('../models');
  moment = require('moment');
  jwt = require('jwt-simple');
  config = require('../../config/config');


module.exports = function (app) {
  app.use('/api', router);
};

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

/*
 |--------------------------------------------------------------------------
 | Log in
 |--------------------------------------------------------------------------
 */

router.post('/auth/login', function(req, res) {
  db.User.findOne({
    where: { facebook_key: req.body.facebook_key }
  }).then(function (user){
    if (!user) {
      db.User.create({
          facebook_key: req.body.facebook_key,
          email: req.body.email,
          names: req.body.names,
          surnames: req.body.surnames,
          user_image: req.body.user_image
        }).then(function (new_user){
          res.json({ token: createJWT(new_user),
                     user: new_user });
        });
    } else {
      res.json({ token: createJWT(user),
                 user: user });
    }
  });
});

/*
 |--------------------------------------------------------------------------
 | Home newsfeed API
 |--------------------------------------------------------------------------
 */

router.get('/', ensureAuthenticated, function (req, res, next) {
  // db.Photo.findAll({
  //   include: [{ model: db.User,
  //               required: true,
  //               where: {id: req.user_id },
  //               include: [{ model: db.Follower,
  //                           required: false
  //                           // where: [{ follower_id: req.user_id }]
  //                         }]
  //            }]
  // }).then(function (photos) {
  //   res.json(photos);
  // });
  var query = 'SELECT DISTINCT ON (p.id) p.user_id, names, user_image, file_name, title, date, ' +
                      'p.id as "photo_id" ' +
                'FROM "Photos" AS p ' +
                'INNER JOIN "Followers" AS f ON p.user_id = f.user_id ' +
                'INNER JOIN "Users" AS u ON u.id = f.user_id ' +
                'WHERE follower_id = :user_id  OR p.user_id = :user_id ' +
                'ORDER BY p.id DESC';

  db.sequelize.query(query, { replacements: { user_id: req.user_id },
                              type: db.sequelize.QueryTypes.SELECT
                            })
  .then(function(users) {
    res.json(users);
    // We don't need spread here, since only the results will be returned for select queries
  });
});

router.get('/tweets', function (req, res) {
  var query = 'SELECT DISTINCT ON (t.id) t.user_id, names, user_image, ' +
                      't.id as "tweet_id", t.* ' +
                'FROM "Tweets" AS t ' +
                'INNER JOIN "Users" AS u ON u.id = t.user_id ' +
                'ORDER BY t.id DESC';

  db.sequelize.query(query, { replacements: { user_id: req.user_id },
                              type: db.sequelize.QueryTypes.SELECT
                            })
  .then(function(users) {
    res.json(users);
    // We don't need spread here, since only the results will be returned for select queries
  });
});
