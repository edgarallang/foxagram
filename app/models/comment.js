// comments model


module.exports = function (sequelize, DataTypes) {

  var Comment = sequelize.define('Comment', {
    user_id: DataTypes.INTEGER,
    photo_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // example on how to add relations
        Comment.belongsTo(models.User);
      }
    }
  });

  return Comment;
};
