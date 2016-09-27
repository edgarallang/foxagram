
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    facebook_key: DataTypes.STRING,
    email: DataTypes.STRING,
    names: DataTypes.STRING,
    surnames: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models){
        User.belongsToMany(models.Photo, { through: 'photo_user', foreignKey: 'id', otherKey: 'user_id' });
        User.belongsToMany(models.Follower, { through: 'follower_user', foreignKey: 'id', otherKey: 'user_id' });
        User.belongsToMany(models.Follower, { through: 'follower_user', foreignKey: 'id', otherKey: 'follower_id' });
      }
    }

  });

  return User;
};
