// comments model


module.exports = function (sequelize, DataTypes) {

  var Comment = sequelize.define('Comment', {
    user_id: DataTypes.INTEGER,
    photo_id: DataTypes.INTEGER,
    comment_body: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // example on how to add relations
        Comment.belongsTo(models.User, { foreignKey: 'user_id', otherKey: 'id' });
        Comment.belongsTo(models.Photo, { foreignKey: 'photo_id', otherKey: 'id' });
      }
    }
  });

  return Comment;
};
