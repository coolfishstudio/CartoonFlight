var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs');

var port = 9301;

http.createServer(function (req, res) {
	var pathname = __dirname + '/release' + url.parse(req.url).pathname;
	if (pathname.charAt(pathname.length -1) == '/') {
		pathname += 'index.html';
	}
	fs.exists(pathname, function (exists) {
		if(exists){
			switch (path.extname(pathname)) {
				case '.html':
					res.writeHead(200, {'Content-Type': 'text/html'});
					break;
				case '.js':
					res.writeHead(200, {'Content-Type': 'text/javascript'});
					break;
				case '.css':
					res.writeHead(200, {'Content-Type': 'text/css'});
					break;
				case '.gif':
					res.writeHead(200, {'Content-Type': 'image/git'});
					break;
				case '.jpg':
					res.writeHead(200, {'Content-Type': 'image/jpeg'});
					break;
				case '.png':
					res.writeHead(200, {'Content-Type': 'image/png'});
					break;
				case '.json':
					res.writeHead(200, {'Content-Type': 'application/json'});
					break;
				case '.fnt':
					res.writeHead(200, {'Content-Type': 'txt/plain'});
					break;
				case '.mp3':
					res.writeHead(200, {'Content-Type': 'audio/mpeg'});
					break;
				default:
					res.writeHead(200, {'Content-Type': 'application/octet-stream'});
				 	break;
			}
			fs.readFile(pathname, function (err, data) {
				res.end(data);	
			});
		}else{
			res.writeHead(404, {'Content-Type': 'text/html'});
			res.end('<h1>404 Not Found</h1>');
		}
	});
}).listen(process.env.PORT || port, function(){
	console.log('项目已经启动, 端口号为' + port);
});