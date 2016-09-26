
var express = require('express'),
  router = express.Router(),
  db = require('../models');
  moment = require('moment');
  jwt = require('jwt-simple');
  config = require('../../config/config');


module.exports = function (app) {
  app.use('/', router);
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

router.post('/auth/login', function(req, res){
  db.User.findOne({
    where: { facebook_key: req.body.facebook_key }
  }).then(function (user){
    if (!user) {
      db.User.create({
          facebook_key: req.body.facebook_key,
          username: req.body.email,
          names: req.body.names,
          surnames: req.body.surnames
        }).then(function (new_user){
          res.json({token:  createJWT(new_user) });
        });
    }else{
      res.json({token: createJWT(user)});
    }
  });
});
/*
 |--------------------------------------------------------------------------
 | Home newsfeed API
 |--------------------------------------------------------------------------
 */

router.get('/', ensureAuthenticated, function (req, res, next) {
  db.Photo.findAndCountAll({
    include: [{ model: db.User,
                required: true,
                include: [{ model: db.Follower,
                            required: true,
                            where: { follower_id: req.user_id }
                          }]
             }]
  }).then(function (photos) {
    res.json(photos);
  });
});
