const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const models = require('./models')

const app = express()

const origin = process.env.NODE_ENV === 'production'
  ? ['http://heroes.johncarmichael.me']
  : '*'

const corsOptions = {
  origin,
  allowedHeaders: ['Content-Type'],
  methods: 'GET,POST',
  optionsSuccessStatus: 200, // some legacy browsers choke on 204
}

app.use(cors(corsOptions))

app.get('/heroes', async (request, response) => {
  const heroes = await models.Heroes.findAll({ include: { model: models.Teams } })

  response.send(heroes)
})

app.get('/heroes/:slug', async (request, response) => {
  const hero = await models.Heroes.findOne({
    where: { slug: request.params.slug },
    include: { model: models.Teams }
  })

  if (hero) {
    response.send(hero)
  } else {
    response.sendStatus(404)
  }
})

app.post('/heroes', bodyParser.json(), async (request, response) => {
  const { name, realname, firstappearance, slug, teamSlug } = request.body

  if (!name || !realname || !firstappearance || !slug || !teamSlug) {
    return response.status(400).send('The following attributes are required: name, realname, firstappearance, slug, teamSlug')
  }

  const team = await models.Teams.findOne({ where: { slug: teamSlug } })

  if (!team) {
    return response.status(400).send(`Unknown team slug: ${teamSlug}`)
  }

  const newHero = await models.Heroes.create({ name, realName, firstAppearance, slug, teamId: team.id })
  response.status(201).send(newHero)
})

app.all('*', (request, response) => {
  response.sendStatus(404)
})

const port = process.env.NODE_ENV === 'production' ? 80 : 1337
app.listen(port, () => { console.log(`Listening on ${port}...`) })

module.exports = app
