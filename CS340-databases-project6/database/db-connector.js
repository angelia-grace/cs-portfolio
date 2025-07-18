// ./database/db-connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
// (Credentials removed for public portfolio)
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'username',
    password        : 'password',
    database        : 'database'
})

// Export it for use in our applicaiton
module.exports.pool = pool;
