var http = require('http');
var url = require('url');
var loginController = require('./loginController');
var configurationController = require('./configurationController');
 
var resourceName = "configuration";
var server = new http.Server();
server.listen(3000)
console.log('localhost: Server running on port 3000');	
	
server.on('request', function (request, response) {
    var cookie = request.headers.cookie;
    var params = url.parse(request.url).pathname.split('/');
    var requestBody = '';

    request.on('data', function (chunk) {
        requestBody += chunk.toString();
    });

    request.on('end', function () {
        var result;
		var resource = params[1];
        if ('login' === resource) {
			var actionParam = params[2];
            result = loginController.login(request.method, actionParam, cookie, requestBody);
        } else if (resource === resourceName) {	
			if(cookie && loginController.cookies[cookie]) {
				result = configurationController.process(request.method, resource, params[2], params[3], requestBody);
			} else {
	            result = {
					success: false,
	                statusCode : 403,
	                header : {"Content-Type": "application/json"},
	                message : 'Unauthorized user.'
	            };
			}
            
        } else {
            result = {
				success: false,
                statusCode : 404,
                header : {"Content-Type": "application/json"},
                message : 'Unindentified resource.'
            };
        }
		console.log('******************');
		console.log(result);
        response.writeHead(result.statusCode, result.header);
        response.end(result.message);
    })
})