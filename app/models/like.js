// Like model


module.exports = function (sequelize, DataTypes) {

  var Like = sequelize.define('Like', {
    user_id: DataTypes.INTEGER,
    photo_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // example on how to add relations
        Like.belongsTo(models.User);
      }
    }
  });

  return Like;
};
