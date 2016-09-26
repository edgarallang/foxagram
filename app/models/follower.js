// Follower model


module.exports = function (sequelize, DataTypes) {

  var Follower = sequelize.define('Follower', {
    user_id: DataTypes.INTEGER,
    follower_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // example on how to add relations
        Follower.belongsTo(models.User, { through: 'follower_user', foreignKey: 'user_id', otherKey: 'id'});
        Follower.belongsTo(models.User, { through: 'follower_user', foreignKey: 'follower_id', otherKey: 'id'});
      }
    }
  });

  return Follower;
};
