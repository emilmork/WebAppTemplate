var st   = require('st'),
  http   = require('http')

var mount = st({
  path: __dirname + '/public',
  url: '/',
  cache: false,
  index: 'index.html'
});

http.createServer(function(req, res) {
  var stHandled = mount(req, res);
  if (stHandled)
    return
  else
    res.writeHead(404);
    res.end();
}).listen(8080)

console.log("Server listening on port 8080");