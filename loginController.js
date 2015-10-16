var registeredUsers = {'richa': 'test123', 'tenable': 'test'};
var cookies = {};

module.exports = {
    cookies: cookies,
    login: function login(method, username, cookie, requestBody) {
        var result = {
            success: true,
            statusCode: 200,
            header: {"Content-Type": "application/json"}
        };

        var data;

        if (!username) {
            result.statusCode = 400;
            result.message = 'Please provide a username.';
            result.success = false;
        } else if (!registeredUsers[username]) {
            result.statusCode = 404;
            result.message = 'User not found';
            result.success = false;
        } else if (method === 'POST' || method === 'PUT') {
            if (!requestBody) {
                result.statusCode = 404;
                result.message = 'Please supply request body to perform action. Password is required.';
                result.success = false;
            } else {
                data = JSON.parse(requestBody);
            }
        }

        if (!result.success) {
            return result;
        }

        switch (method) {
            case 'PUT':
            case 'POST':
                if (!data.password) {
                    result.statusCode = 400;
                    result.success = false;
                    result.message = 'Please specify a password.';
                } else if (registeredUsers[username] !== data.password) {
                    result.statusCode = 403;
                    result.success = false;
                    result.message = 'Incorrect password.';
                } else {
                    var id = 'authorizationToken=' + Math.random();
                    cookies[id] = true;
                    result.header['Set-Cookie'] = id + ";path=/";
                    result.message = 'User has been logged in.';
                }
                break;
            case 'DELETE':
                if (cookie) {
                    var id = cookie.split('=')[1];
                    cookies[id] = false;
                    result.header['Set-Cookie'] = "authorizationToken=-1;path=/";
                    result.message = 'User has been logged out.';
                } else {
                    result.statusCode = 403;
                    result.success = false;
                    result.message = 'You are not authorized to perform this action';
                }
                break;
            default:
                result.statusCode = 400;
                result.success = false;
                result.message = 'This action is not supported.';
                break;
        }
        return result;
    }
};