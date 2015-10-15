## nodejs-restful-service

### How to run the app:
* Download/clone the code
* Install NodeJs - https://docs.npmjs.com/getting-started/installing-node
* Navigate to the downloaded folder.
* Run - node server.js


### How to use the api:
* Start with login - POST to localhost:3000/login/richa with body {"password": "test123"}. Specify Content-Type of application/json
* Get all Configurations - localhost:3000/configuration
* Get by name - localhost:3000/configuration/name/host1
* Get by hostname - localhost:3000/configuration/hostname/nessus-ntp.lab.com
* Get by port - localhost:3000/configuration/port/1241
* Get by username - localhost:3000/configuration/username/toto
* Create new configuration - POST to localhost:3000/configuration with body {"name": "host3","hostname": "test.lab.com","port": "5555", "username":"test"}
* Update a configuration - PUT to localhost:3000/configuration/id/{id} with desired updates.
* Delete a configuration - localhost:3000/configuration/id/{id}
* End with logout - Delete localhost:3000/login/richa
  

