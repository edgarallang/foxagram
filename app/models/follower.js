// Follower model


module.exports = function (sequelize, DataTypes) {

  var Follower = sequelize.define('Follower', {
    user_id: DataTypes.INTEGER,
    follower_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // example on how to add relations
        Follower.belongsTo(models.User, {foreign_key: 'user_id'});
        Follower.belongsTo(models.User, {foreign_key: 'follower_id'});
      }
    }
  });

  return Follower;
};
