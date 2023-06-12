var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs');

var port = 3906;

http.createServer(function (req, res) {
	var pathname = __dirname + '/release' + url.parse(req.url).pathname;
	if (pathname.charAt(pathname.length -1) == '/') {
		pathname += 'index.html';
	}
	function serve(type){
		res.writeHead(200, {
			'Content-Type': type,
			'Access-Control-Allow-Origin': '*'
		});
	}
	fs.exists(pathname, function (exists) {
		console.log('pathname', pathname, exists);
		if(exists){
			switch (path.extname(pathname)) {
				case '.html':
					serve('text/html');
					break;
				case '.js':
					serve('text/javascript');
					break;
				case '.css':
					serve('text/css');
					break;
				case '.gif':
					serve('image/git');
					break;
				case '.jpg':
					serve('image/jpeg');
					break;
				case '.png':
					serve('image/png');
					break;
				case '.json':
					serve('application/json');
					break;
				case '.fnt':
					serve('txt/plain');
					break;
				case '.mp3':
					serve('audio/mpeg');
					break;
				default:
					serve('application/octet-stream');
				 	break;
			}
			fs.readFile(pathname, function (err, data) {
				res.end(data);
			});
		}else{
			res.writeHead(404, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
			res.end('<h1>404 Not Found</h1>');
		}
	});
}).listen(process.env.PORT || port, function(){
	console.log('项目已经启动, 端口号为' + port);
});
