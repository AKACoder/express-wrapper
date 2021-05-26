function Response(res, result, err = null) {
  res.status(200)
  res.json({Result: result, Error: err});
}

module.exports = {
  Response
}