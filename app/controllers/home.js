
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

router.get('/', function (req, res, next) {
  db.Photo.findAndCountAll({
    where: { user_id: 5, 'user.user_id': 3 },
    include: [db.User, {model: db.User, as: 'user'}]
  }).then(function (photos) {
    res.json(photos);
  });
});

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
          email: req.body.email,
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
