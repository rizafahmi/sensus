import express from 'express'
import nunjucks from 'nunjucks'

const PORT = process.env.PORT || 3000
const server = express()

nunjucks.configure(['templates/'], {
  autoescape: true,
  express: server
})

// server.set('views', 'templates')
server.set('view engine', 'html')

server.get('/', function(req, res) {
  res.redirect('/jakartajs')
})

const community = { name: "JakartaJS", slug: "jakartajs" }

server.get('/jakartajs', function(req, res) {
  res.render('communities/index.html', { community, title: "Daftar Acara" })
})

server.get('/jakartajs/events/new', function(req, res) {
  res.render('events/new.html', { community })
})

server.post('/jakartajs/events/new', function(req, res) {
  res.redirect('/jakartajs')
})

server.get('/ping', function(req, res) {
  res.json({ status: 'OK' })
})

server.use(express.static('public'))

server.listen(PORT, function() {
  console.info(`Listening on port ${PORT}`)
})
