import express from 'express'
import nunjucks from 'nunjucks'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import knex from 'knex'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import { sendEmail } from './utils.js'

const PORT = process.env.PORT || 8080
const server = express()

nunjucks.configure(['templates/'], {
  autoescape: true,
  express: server
})

// server.set('views', 'templates')
server.set('view engine', 'html')

server.use(bodyParser.urlencoded({ extended: false }))
server.use(cookieParser())

const community = { name: "JakartaJS", slug: "jakartajs" }

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://riza:@localhost:5432/sensus_dev'
})

server.get('/', async function(req, res) {
  // for testing database connection
  const users = await db.select('name').from('users')

  res.render('index.html', { title: "Sensus untuk Komunitas" })
})

server.get('/members/register', function(req, res) {
  res.render('members/register.html', { title: "Sensus untuk Komunitas" })
})

server.post('/members/register', async function(req, res) {
  const { email, name } = req.body;
  // TODO: sanitize user input

  // insert to database
  try {
    await db.insert({ email, name }).into('users')
  } catch (err) {
    console.error(err)
  }

  res.redirect('/members/login')
})

server.get('/members/login', function(req, res) {

  res.render('members/login.html', { title: "Sensus untuk Komunitas" })
})

server.post('/members/login', async function(req, res) {
  const { email } = req.body;
  try {
    const { id } = await db.select('id').from('users').where({ email }).first()
    sendEmail(email, id)
  } catch (err) {
    console.error(err)
  }
  res.render('members/login.html', { title: "Sensus untuk Komunitas", info: "Cek email kamu." })
})

server.get('/members/authenticate', function(req, res) {
  if (req.query.token) {
    const { token } = req.query
    console.log(token)

    try {
      const decoded_token = jwt.verify(token, process.env.JWT_SECRET)
      console.log(decoded_token)

      const sessionid = crypto.randomBytes(16).toString('base64')

      res.cookie('sessionid', sessionid/*, { httpOnly: true, secure: true }*/)
      res.cookie('sub', decoded_token.sub)

      res.redirect('/jakartajs')
    } catch (err) {
      console.error(err)
    }

  }
})

server.get('/members/logout', function(req, res) {
  res.clearCookie('sessionid')
  res.clearCookie('sub')
  res.redirect('/')
})

server.get('/jakartajs', checkAuth, function(req, res) {
  res.render('communities/index.html', { community, title: "Daftar Acara" })
})

server.get('/jakartajs/members', function(req, res) {
  res.render('members/index.html', { community })
})

server.get('/jakartajs/events/new', checkAuth, function(req, res) {
  res.render('events/new.html', { community })
})

server.get('/jakartajs/events/detail', function(req, res) {
  const event = { title: "#61 JakartaJS X Hijra" }
  res.render('events/detail.html', { community, event, title: event.title })
})

// RSVP
server.post('/jakartajs/events/detail', checkAuth, function(req, res) {
  const event = { title: "#61 JakartaJS X Hijra" }
  res.render('events/detail.html', { community, event, title: event.title, info: "RSVP berhasil! Sampai jumpa di lokasi acara!!" })
})

server.post('/jakartajs/events/new', checkAuth, function(req, res) {
  res.redirect('/jakartajs')
})

// Route untuk absensi
// Halaman ada nama peserta yang autocomplete
server.get('/jakartajs/events/detail/sensus', checkAuth, function(req, res) {
  const event = { title: "#61 JakartaJS X Hijra" }
  res.render('events/sensus.html', { community, event, title: event.title })
})

server.post('/jakartajs/events/detail/sensus', checkAuth, function(req, res) {
  res.redirect('/jakartajs/events/detail')
})

server.get('/ping', function(req, res) {
  res.json({ status: 'OK' })
})

server.use(express.static('public'))

server.use(function(req, res) {
  res.status(404).end()
})

server.use(function(err, req, res, next) {
  res.clearCookie('sessionid')
  res.clearCookie('sub')
  res.status(err.status || 500).send(err.message || 'Problem.')
})

server.listen(PORT, function() {
  console.info(`Listening on port ${PORT}`)
})

function checkAuth(req, res, next) {
  console.log(req.cookies.sessionid)
  if (req.cookies.sessionid !== undefined) {
    next()
  } else {
    res.redirect('/members/login')
  }
}
