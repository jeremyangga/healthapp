'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');

const { options } = require('../routers');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Doctor, {foreignKey: 'userId'});
      User.hasOne(models.Patient, {foreignKey: 'userId'});
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull : {
          msg : 'Username required!'
        },
        notEmpty : {
          msg : 'Username required!'
        },
        // isUnique(value) {
        //   let data = User.findAll({
        //     where: {
        //           username: value
        //         }
        //   })
        //   if(data.length !== 0){
        //     throw new Error('Username already exists');
        //   }
        // }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull : {
          msg : 'Password required!'
        },
        notEmpty : {
          msg : 'Password required!'
        },
        len : {
          args : [8, 24],
          msg: 'Minimum 8 password character!'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull : {
          msg : 'Role required!'
        },
        notEmpty : {
          msg : 'Role required!'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate( async(user, options)=>{
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
  })

  return User;
};