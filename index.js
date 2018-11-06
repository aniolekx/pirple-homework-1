/* Api */

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;


let server = http.createServer(function (req, res) {
    unifiedServer(req,res);
});

server.listen(3000, function () {
    console.log('The HTTP server is listening on port 3000 now :)');
});

let unifiedServer = function(req, res) {
    let parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', function(data) {
        buffer +=decoder.write(data);
    });

    req.on('end', function() {

        buffer+=decoder.end();
    
        let chosenHandler = typeof(router[path]) !== 'undefined' ? router[path] : function(data, callback) {
            callback(404);
        };

        let data  = {
            'path': path,
            'queryStringObject': parsedUrl.query,
            'method': req.method.toLowerCase(),
            'headers': req.headers,
            'playload': buffer
        }

        chosenHandler(data, function(statusCode, payload) { 
            statusCode == typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};
            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString)
        });
    });
};

let router = {
    'hello': function(data, callback) {
        callback(200, {msg: 'Hello and Welcome Anonymous User!'});
    }
};
