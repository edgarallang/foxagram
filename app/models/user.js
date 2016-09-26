
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    facebook_key: DataTypes.STRING,
    email: DataTypes.STRING,
    names: DataTypes.STRING,
    surnames: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models){
        User.hasMany(models.Comment);
      }
    }

  });

  return User;
};
