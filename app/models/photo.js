module.exports = function (sequelize, DataTypes) {
  var Photo = sequelize.define('Photo', {
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models){
        Photo.belongsTo(models.User);
      }
    }

  });

  return Photo;
};
