'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MedicalRecord.belongsTo(models.Patient, {foreignKey: 'patientId'});
      MedicalRecord.belongsTo(models.Doctor, {foreignKey: 'doctordId'});
    }
  }
  MedicalRecord.init({
    diagnosis: DataTypes.TEXT,
    treatment: DataTypes.TEXT,
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MedicalRecord',
  });
  return MedicalRecord;
};