'use strict';

const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {email: 'the_house@poker.io', username: 'The_House', hashedPassword:bcrypt.hashSync('TheHouseAlwaysWins')},
      {email: 'JudyGovitt@fake.email', username: 'jGovitt', hashedPassword: bcrypt.hashSync('password')},
      {email: 'JohnDoe@fake.email', username: 'JDoe1', hashedPassword: bcrypt.hashSync('password')}
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: {[Op.in]: ['The_House', 'jGovitt','JDoe1'] }
    }, {});
  }
};
