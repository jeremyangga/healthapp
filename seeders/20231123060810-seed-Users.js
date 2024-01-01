'use strict';
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   let data = JSON.parse(await fs.readFile('./data/users.json','utf-8'));
   data = data.map(el=>{
      delete el.id;
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(el.password, salt);
      el.password = hash;
      el.createdAt = el.updatedAt = new Date;
      return el;
   })
   await queryInterface.bulkInsert('Users', data, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
