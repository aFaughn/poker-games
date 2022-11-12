'use strict';
//VSCode insists validator isn't being read here but it definitely is on line 21.
const { Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

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
  }, {
    // Scopes
    // DefaultScope makes it so queries like Users.findAll() doesn't return sensitive info as excluded here.
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
      },
    },
    // Specific scopes for this info need to be called using User.scope('loginUser') to get all info.
    scopes: {
      currentUser: {
        attributes: { exclude: ['hashedPassword']},
      },
      loginUser: {
        attributes: {}
      },
    },
  });
  User.associate = function(models) {
    //Associations can be defined here

    // Return the specified user's id, username, and email.
    User.prototype.toSafeObject = function() {
      const { id, username, email } = this; //Declare id, username, and email as this instance of these variables.
      return {id, username, email };
    };

    // Return a boolean value representing the matching or mismatch of a specified user's password.
    User.prototype.validatePassword = function() {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    };

    // Return logged in user's information (except password) by supplying the user's ID.
    User.getCurrentUserById = async function(id) {
      return await User.scope('currentUser').findByPk(id);
    };

    // Login a user by passing in a username / email credential and a string password.
    User.login = async function ({ credential, password }) {

      // Op is short for 'Operators' in Sequelize. See line 93 where we use the OR operand.
      const { Op } = require('sequelize');

      // Query for the user by it's ID
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential,
          },
        },
      });

      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    };

    // Create a new user -- supply a username, email and password to be encrypted.
    User.signup = async function({username, email, password}) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword,
      });
      return await User.scope('currentUser').findByPk(user.id);
    }

  };
  return User;
};
