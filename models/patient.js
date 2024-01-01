'use strict';
const {
  Model
} = require('sequelize');
const { calculateBMI } = require('../helper');
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
    static calculateAge(value){
      let dateOfFound = new Date(value);
      let month_diff = Date.now() - dateOfFound.getTime();
      let age_dt = new Date(month_diff);
      let year = age_dt.getUTCFullYear();
      let age = year-1970;
      return age;
    }
    get date(){
      return this.DoB.toISOString().substring(0, 10);
    }
  }
  Patient.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull : {
          msg : 'Name required!'
        },
        notEmpty : {
          msg : 'Name required!'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull : {
          msg : 'Image required!'
        },
        notEmpty : {
          msg : 'Image required!'
        }
      }
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull : {
          msg : 'Education required!'
        },
        notEmpty : {
          msg : 'Education required!'
        }
      }
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull : {
          msg : 'Weight required!'
        },
        notEmpty : {
          msg : 'Weight required!'
        }
      }
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull : {
          msg : 'Height required!'
        },
        notEmpty : {
          msg : 'Height required!'
        }
      }
    },
    bmi: DataTypes.FLOAT,
    DoB: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull : {
          msg : 'DoB required!'
        },
        notEmpty : {
          msg : 'DoB required!'
        }
      }
    },
    age: DataTypes.INTEGER,
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull : {
          msg : 'Gender required!'
        },
        notEmpty : {
          msg : 'Gender required!'
        }
      }
    },
    userId : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Patient',
  });
  Patient.beforeCreate( async(patient, options)=>{
    patient.age = Patient.calculateAge(patient.DoB);
    patient.bmi = calculateBMI(patient.weight, patient.height);
  })
  return Patient;
};