module.exports = (sequelize, Sequelize) => {
  return sequelize.define('teams', {
    id: {
      type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true,
    },
    name: { type: Sequelize.STRING, },
    slug: { type: Sequelize.STRING, }
  })
}
