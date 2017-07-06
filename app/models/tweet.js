module.exports = function (sequelize, DataTypes) {
  var Tweet = sequelize.define('Tweet', {
    user_id: DataTypes.INTEGER,
    tweet: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models){
        Tweet.belongsTo(models.User, { through: 'tweet_user', foreignKey: 'user_id', otherKey: 'id'});
      }
    }

  });

  return Tweet;
};
