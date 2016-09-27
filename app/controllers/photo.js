var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  multer = require('multer'),
  mkdirp = require('mkdirp');
  

module.exports = function (app) {
  app.use('/photo', router);
};

router.get('/by/id/:photoId', function(req, res){
	db.Photo.findOne({
		where: { id: req.params.photoId }
	}).then(function (photo){
		if(!photo){
			res.json({message: 'photo doesnt exist' });
		}else{
			res.json({data: photo});
		}
	});
});

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

router.post('/upload', ensureAuthenticated,function (req, res, next) {
  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      mkdirp('./photos/' + req.user_id, function (err) {
        if (!err){
          callback(null, './photos/' + req.user_id);
        }else{
          console.log("ERROR");

        }
      });
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + '.jpeg');
    }
  });

  var upload = multer({ storage : storage, dest: 'photos/' }).single('photo');

	upload(req ,res , function(err) {
        if(err) {
          res.json({message: 'Error uploading photo.'});
        }else{
          db.Photo.create({
            user_id: req.user_id,
            title: req.body.title,
            date: Date.now(),
            file_name: req.file.filename
          }).then(function (photo){
            res.json({message:  'Photo uploaded' });
          });
		    }
    });
});

router.get('/upload_test', function (req, res, next) {
  db.Article.findAll().then(function (articles) {
    res.render('photo', {
      title: 'Upload test'
    });
  });
});