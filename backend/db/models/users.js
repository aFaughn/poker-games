'use strict';
//VSCode insists validator isn't being read here but it definitely is on line 21.
const { Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  //Create a new table referenced here as User in SQLZ using the define method of the SQLZ class.
  const User = sequelize.define('User', {

    // Column Username: Type, can it be nulled, and these are the validations....
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //Must be between 4 and 30 chars
        len: [4,30],

        //  isNotEmail is a custom SQLZ validator
        // It takes in the value that is trying to be created as the user
        // and checks it with SQLZ's built in validator and throws an error if it is an email.
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error('Cannot be an email');
          }
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3,256]
      },
    },

    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60,80]
      },
    },
  }, {});
  User.associate = function(models) {
    //Associations can be defined here
  };
  return User;
};
