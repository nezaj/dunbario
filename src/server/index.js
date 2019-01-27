/* eslint no-console: 0 */
/* Entry-point for our express server */

const path = require('path')

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const program = require('commander')

function main() {
  // Initialize app
  let app = express()

  /* --------- BEGIN Middlewares --------- */
  // Logging
  app.use(morgan('dev'))

  // Cross Origin Resource Sharing
  app.use(cors())

  // Configure static directory
  const publicDir = 'build'
  const staticDir = path.join(__dirname, '..', '..', publicDir)
  app.use(express.static(staticDir))

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

  // Make all routes serve index.html so our front-end app can take over
  app.get('/*', function(req, res) {
    res.sendFile(__dirname, 'index.html')
  })

  /* --------- END Middlewares --------- */

  // Create HTTP server
  let port = process.env.PORT || 8000
  app.listen(port)
  console.log(`Express listening on port ${port}`)
}

if (require.main === module) {
  program
    .description('Info: Start the backend webserver')
    .usage(': node server.py [options]')
    .parse(process.argv)

  main(program)
}
