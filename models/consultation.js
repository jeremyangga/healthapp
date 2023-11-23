'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Consultation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Consultation.belongsTo(models.Doctor, {foreignKey: 'doctorId'});
      Consultation.belongsTo(models.Patient, {foreignKey: 'patientId'});
    }
  }
  Consultation.init({
    complaint: DataTypes.TEXT,
    images: DataTypes.STRING,
    isDone: DataTypes.BOOLEAN,
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Consultation',
  });
  return Consultation;
};