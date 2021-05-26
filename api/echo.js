let router = require('express').Router()
let baseUri = require('./apiNamespace').API_BASE_URI
let Response = require('./response').Response

async function Action(req, res) {
  console.log("will echo: ", JSON.stringify(req.body))
  Response(res, req.body, null)
}

let uri = `${baseUri}/echo`

router.post(`/`, Action)

module.exports = {
  router,
  uri,
}
