const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cat extends Model {}
  Cat.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      createdAt: 'addedAt',
      updatedAt: 'lastSeenAt',
    },
  );
  return Cat;
};
