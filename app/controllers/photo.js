var express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/photo', router);
};

router.get('/by/id/:photoId', function(req, res){
	db.Photo.findOne({
		where: { id: req.params.photoId }
	}).then(function (photo){
		if(!photo){
			res.json({message: 'photo doesnt exist' })
		}else{
			res.json({data: photo})
		}
	});
});

router.get('/upload', function(req, res){
	db.Photo.findOne({
		where: { id: req.params.photoId }
	}).then(function (photo){
		if(!photo){
			res.json({message: 'photo doesnt exist' })
		}else{
			res.json({message: photo})
		}
	});
});