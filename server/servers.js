let servers = [
  require('./instance/webServer'),
]

servers.forEach(s=>{
  s.Start()
})

