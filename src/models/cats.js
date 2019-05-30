const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cats extends Model {}
  Cats.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize },
  );
  return Cats;
};
