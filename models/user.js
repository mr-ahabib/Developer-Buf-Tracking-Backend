'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: {
  type: DataTypes.STRING,
  unique: true,        // <-- Add this line
  allowNull: false     // (optional but recommended)
},

    password: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'tester', 'developer')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};