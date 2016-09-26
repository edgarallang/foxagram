module.exports = function (sequelize, DataTypes) {
  var Photo = sequelize.define('Photo', {
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    file_name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models){
        Photo.belongsTo(models.User, { foreign_key: 'user_id', target: 'id'});
        Photo.hasMany(models.Comment);
      }
    }

  });

  return Photo;
};
