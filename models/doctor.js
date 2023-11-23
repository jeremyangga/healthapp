'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor.belongsTo(models.User, {foreignKey: 'userId'});
      Doctor.belongsTo(models.Specialist, {foreignKey: 'doctorId'});
      Doctor.hasMany(models.MedicalRecord, {foreignKey: 'doctorId'});
      Doctor.hasMany(models.Receipt, {foreignKey: 'doctorId'});
      Doctor.hasMany(models.Consultation, {foreignKey: 'doctorId'});
    }
  }
  Doctor.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    education: DataTypes.STRING,
    specialistId: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    height: DataTypes.FLOAT,
    bmi: DataTypes.FLOAT,
    DoB: DataTypes.DATE,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    userId : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Doctor',
  });
  return Doctor;
};