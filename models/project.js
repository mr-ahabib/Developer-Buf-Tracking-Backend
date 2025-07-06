'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.User, { foreignKey: 'email', targetKey: 'email' });
    }
  }
  Project.init(
    {
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      details: DataTypes.TEXT,
      assignedTester: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Project',
    }
  );
  return Project;
};
