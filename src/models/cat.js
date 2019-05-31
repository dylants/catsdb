const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cat extends Model {}
  Cat.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      breed: { type: DataTypes.STRING },
      birthdate: { type: DataTypes.DATEONLY },
      imageUrl: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING, allowNull: false },
      username: { type: DataTypes.STRING, allowNull: false },
      weight: { type: DataTypes.FLOAT },
    },
    {
      sequelize,
      createdAt: 'addedAt',
      updatedAt: 'lastSeenAt',
    },
  );
  return Cat;
};
