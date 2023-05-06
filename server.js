import express from 'express'
import nunjucks from 'nunjucks'

const PORT = process.env.PORT || 8080
const server = express()

nunjucks.configure(['templates/'], {
  autoescape: true,
  express: server
})

// server.set('views', 'templates')
server.set('view engine', 'html')

const community = { name: "JakartaJS", slug: "jakartajs" }

server.get('/', function(req, res) {
  res.render('members/login.html', { title: "Login" })
})

server.post('/members/login', function(req, res) {
  res.redirect('/jakartajs')
})

server.get('/jakartajs', function(req, res) {
  res.render('communities/index.html', { community, title: "Daftar Acara" })
})

server.get('/jakartajs/members', function(req, res) {
  res.render('members/index.html', { community })
})

server.get('/jakartajs/events/new', function(req, res) {
  res.render('events/new.html', { community })
})

server.get('/jakartajs/events/detail', function(req, res) {
  const event = { title: "#61 JakartaJS X Hijra" }
  res.render('events/detail.html', { community, event, title: event.title })
})

// RSVP
server.post('/jakartajs/events/detail', function(req, res) {
  const event = { title: "#61 JakartaJS X Hijra" }
  res.render('events/detail.html', { community, event, title: event.title, info: "RSVP berhasil! Sampai jumpa di lokasi acara!!" })
})

server.post('/jakartajs/events/new', function(req, res) {
  res.redirect('/jakartajs')
})

// Route untuk absensi
// Halaman ada nama peserta yang autocomplete
server.get('/jakartajs/events/detail/sensus', function(req, res) {
  const event = { title: "#61 JakartaJS X Hijra" }
  res.render('events/sensus.html', { community, event, title: event.title })
})

server.post('/jakartajs/events/detail/sensus', function(req, res) {
  res.redirect('/jakartajs/events/detail')
})

server.get('/ping', function(req, res) {
  res.json({ status: 'OK' })
})

server.use(express.static('public'))

server.listen(PORT, function() {
  console.info(`Listening on port ${PORT}`)
})
