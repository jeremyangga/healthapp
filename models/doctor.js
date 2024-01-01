'use strict';
const {
  Model
} = require('sequelize');
const { calculateBMI } = require('../helper');
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
      Doctor.belongsTo(models.Specialist, {foreignKey: 'specialistId'});
      Doctor.hasMany(models.MedicalRecord, {foreignKey: 'doctorId'});
      Doctor.hasMany(models.Receipt, {foreignKey: 'doctorId'});
      Doctor.hasMany(models.Consultation, {foreignKey: 'doctorId'});
    }
    static calculateAge(value){
      let dateOfFound = new Date(value);
      let month_diff = Date.now() - dateOfFound.getTime();
      let age_dt = new Date(month_diff);
      let year = age_dt.getUTCFullYear();
      let age = year-1970;
      return age;
    }
    get title(){
      return `Dr. ${this.name}`
    }
    get date(){
      return this.DoB.toISOString().substring(0, 10);
    }
  }
  Doctor.init({
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
    specialistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull : {
          msg : 'Specialist required!'
        },
        notEmpty : {
          msg : 'Specialist required!'
        },
        checkSpecialist(value){
          if(this.education === 'S1' && value > 1){
            throw new Error('You must be at least S2 to choose specialist, the default specialist below S2 is Dokter Umum');
          }
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
    modelName: 'Doctor',
  });

  Doctor.beforeCreate( async(doctor, options)=>{
    doctor.name = doctor.title;
    doctor.age = Doctor.calculateAge(doctor.DoB);
    doctor.bmi = calculateBMI(doctor.weight, doctor.height);
  })
  return Doctor;
};