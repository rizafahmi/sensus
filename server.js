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
  res.render('index.html', { title: "Express 5" })
})
server.get('/ping', function(req, res) {
  res.json({ status: 'OK' })
})

server.use(express.static('public'))

server.listen(PORT, function() {
  console.info(`Listening on port ${PORT}`)
})
