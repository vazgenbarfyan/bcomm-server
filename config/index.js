const fs = require('fs');
const config = JSON.parse(fs.readFileSync(__dirname+'/config.json'));

module.exports = config;