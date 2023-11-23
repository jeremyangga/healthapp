'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Patient.belongsTo(models.User, {foreignKey: 'userId'});
      Patient.hasOne(models.MedicalRecord, {foreignKey: 'patientId'});
      Patient.hasMany(models.Consultation, {foreignKey: 'patientId'});
      Patient.hasMany(models.Receipt, {foreignKey: 'patientId'});
    }
  }
  Patient.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    education: DataTypes.STRING,
    weight: DataTypes.FLOAT,
    height: DataTypes.FLOAT,
    bmi: DataTypes.FLOAT,
    DoB: DataTypes.DATE,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};