var configuration1 = {id: Math.random(), name: "host1", hostname: "nessus-ntp.lab.com", port: "1241", username: "toto"};
var configuration2 = {id: Math.random(), name: "host2", hostname: "nessus-xml.lab.com", port: "3384", username: "admin"};
var existingConfigurations = [configuration1, configuration2];

module.exports = {
	process: function process (method, requestedResource, key, value, requestBody) {
		var result = {
			success: true,
			statusCode: 200,
			header : {"Content-Type": "application/json"}
		}
		var data;
		if (method === 'POST' || method === 'PUT') {
			data = JSON.parse(requestBody);
		}

		switch (method) {
		case 'GET':
			if (!key) {
				result.message = JSON.stringify(existingConfigurations); //return all configurations.
			} else  {
				var matchingConfigs = existingConfigurations.filter(function (el) {
					return el[key] == value;
				});
				
				if(matchingConfigs) {
					result.message = JSON.stringify(matchingConfigs);
				} else {
					result.statusCode = 404;
					result.success = false;
					result.message = 'No configuration found with key ' + key + ' and value ' + value;            
				}   
			}
			break;
		case 'POST':
			if(data) {
				var newConfig = data;
				data.id =  Math.random();
				existingConfigurations.push(data);
				result.message = 'Created new config with id ' + data.id
				result.statusCode = 201;
				result.header.location = "localhost:3000/configuration/id/" + data.id
			} else {
				result.statusCode = 400;
				result.success = false;
				result.message = 'Please supply data to create new config.';
			}
			break;
		case 'PUT':
			if('id' === key) {
				var matchingConfig = getMatchingConfig(key, value);
				console.log('Matching config for update ' +matchingConfig)		
				if(!matchingConfig) {
					result.message = 'No matching config found to update for id ' + value;
				} else if (matchingConfig[key] !== data[key]) {
					result.message = 'Config ID in the path ' + value + ' does not match the config ID ' + data[key] + ' in the request body.'
				} else {
					for (var k in data) {
						if (data.hasOwnProperty(k) && k !== 'id') {
							matchingConfig[k] = data[k]
						}
					}
					result.message = 'Config with id ' + value + ' has been updated.'
				}

			} else {
				result.statusCode = 400;
				result.success = false;
				result.message = 'Please provide config unique ID to update an existing config.';
			}
			break;
		case 'DELETE':
			if('id' === key) {
				var matchingConfig = getMatchingConfig(key, value);
				existingConfigurations.splice(existingConfigurations.indexOf(matchingConfig), 1);
				result.message = 'Config with id ' + value + ' has been deleted.';
			} else {
				result.statusCode = 400;
				result.success = false;
				result.message = 'Please provide config unique ID to delete an existing config.';
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
}

/*
Returns the first config that matches the key value pair. Use it isolation only when you are expecting unique key.
*/
function getMatchingConfig (key, value) {
	for(var index in existingConfigurations) {
		var config = existingConfigurations[index];
		if(config[key] == value) {			
			return config;
		}
	}
}