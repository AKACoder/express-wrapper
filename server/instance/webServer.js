#!/usr/bin/env node

/**
 * Module dependencies.
 */
let eventHandlers = require('../../common/serverEventHandlers')
let app = require('../../apps/webApp')
let http = require('http')
let port = '8888'

function Start() {
  app.set('port', port)
  let server = http.createServer(app)

  /**
   * Listen on provided port, on all refNetwork interfaces.
   */
  server.listen(port);
  eventHandlers.Register(server, port)

  console.log(`server @${port} is up`)
}

module.exports = {
  Start
}