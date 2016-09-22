var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  multer = require('multer'),
  storage = multer.diskStorage({
	  destination: function (req, file, callback) {
	    callback(null, './uploads');
	  },
	  filename: function (req, file, callback) {
	    callback(null, file.fieldname + '-' + Date.now());
	  }
	}),
  upload = multer({ storage : storage, dest: 'photos/'}).single('userPhoto');



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
router.get('/upload', function (req, res, next) {
	upload(req,res,function(err) {
        if(err) {
            return res.json("Error uploading photo.");
        }else{
			res.json({message:  'Photo uploaded' });
		}
    });
  // req.file is the `avatar` file 
  // req.body will hold the text fields, if there were any 
});

