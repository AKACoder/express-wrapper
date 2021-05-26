function RouterRegister(app, routers) {
  routers.forEach(r=>{
    app.use(r.uri, r.router)
  })
}

module.exports = {
  RouterRegister
}