module.exports = {
    generateConfigs: function generateConfigs(numberOfConfigs) {
        var configs = [];
        for (var i = 1; i <= numberOfConfigs; i++) {
            configs.push({
                id: Math.random(),
                name: 'host' + i,
                hostname: 'test' + i + '.lab.com',
                port: 5000 + i,
                username: 'test' + i,
                commonProperty: i > 10 ? 'something10' : 'something1'
            })
        }
        return configs;
    }
};