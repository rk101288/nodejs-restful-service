var configGenerator = require('./configGenerator');
var utility = require('./utility');

var pageSize = 5;
var existingConfigurations = configGenerator.generateConfigs(30);
var acceptedSortByProperties = ['hostname', 'name', 'username', 'port'];

module.exports = {
    process: function process(method, requestedResource, key, value, requestBody, queries) {
        var result = {
            success: true,
            statusCode: 200,
            header: {"Content-Type": "application/json"}
        };
        var data, matchingConfig;
        if (method === 'POST' || method === 'PUT') {
            data = JSON.parse(requestBody);
        }

        switch (method) {
            case 'GET':
                if (!key) {
                    if(Object.keys(queries).length) {
                        result.message = JSON.stringify(massageData(existingConfigurations, queries));
                    } else {
                        result.message = JSON.stringify(existingConfigurations); //return all configurations.
                    }
                } else {
                    var matchingConfigs = existingConfigurations.filter(function (el) {
                        return el[key] == value;
                    });

                    if (matchingConfigs) {
                        if(Object.keys(queries).length) {
                            result.message = JSON.stringify(massageData(matchingConfigs, queries));
                        } else {
                            result.message = JSON.stringify(matchingConfigs);
                        }

                    } else {
                        result.statusCode = 404;
                        result.success = false;
                        result.message = 'No configuration found with key ' + key + ' and value ' + value;
                    }
                }
                break;
            case 'POST':
                if (data) {
                    data.id = Math.random();
                    existingConfigurations.push(data);
                    result.message = 'Created new config with id ' + data.id;
                    result.statusCode = 201;
                    result.header.location = "localhost:3000/configuration/id/" + data.id;
                } else {
                    result.statusCode = 400;
                    result.success = false;
                    result.message = 'Please supply data to create new config.';
                }
                break;
            case 'PUT':
                if ('id' === key) {
                    matchingConfig = getMatchingConfig(key, value);

                    if (!matchingConfig) {
                        result.message = 'No matching config found to update for id ' + value;
                    } else if (matchingConfig[key] !== data[key]) {
                        result.message = 'Config ID in the path ' + value + ' does not match the config ID ' + data[key] + ' in the request body.';
                    } else {
                        for (var k in data) {
                            if (data.hasOwnProperty(k) && k !== 'id') {
                                matchingConfig[k] = data[k]
                            }
                        }
                        result.message = 'Config with id ' + value + ' has been updated.';
                    }

                } else {
                    result.statusCode = 400;
                    result.success = false;
                    result.message = 'Please provide config unique ID to update an existing config.';
                }
                break;
            case 'DELETE':
                if ('id' === key) {
                    matchingConfig = getMatchingConfig(key, value);
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
};

/*
 Returns the first config that matches the key value pair. Use it isolation only when you are expecting unique key.
 */
function getMatchingConfig(key, value) {
    for (var index in existingConfigurations) {
        var config = existingConfigurations[index];
        if (config[key] == value) {
            return config;
        }
    }
}

function massageData(configs, queries) {
    var result = configs;
    if(queries.hasOwnProperty('page')) {
        if(queries['page'] > 0) {
            var startIndex = (queries['page'] - 1) * 5;
            result = configs.slice(startIndex, startIndex + pageSize)
        }
    }

    if(queries.hasOwnProperty('sort_by')) {
        var sortBy = queries['sort_by'];
        if(acceptedSortByProperties.indexOf(sortBy) < 0) {
            return result;
        }

        var primer = function(a){return a.toUpperCase()} ;

        if('port' == sortBy) {
            primer = parseInt;
        }

        var sortOrder = 'asc';

        if(queries.hasOwnProperty('sort_order') && queries['sort_order'] == 'desc') {
            sortOrder = 'desc';
        }
        result.slice().sort(utility.customSort(sortBy, sortOrder, primer));
    }

    return result;
}


