module.exports = function (sequelize, DataTypes) {
  var Photo = sequelize.define('Photo', {
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    file_name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models){
        Photo.belongsTo(models.User, { through: 'photo_user', foreignKey: 'user_id', otherKey: 'id'});
        Photo.hasMany(models.Comment);
      }
    }

  });

  return Photo;
};
