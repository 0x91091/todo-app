#!/usr/bin/env node

/**
 * Module dependencies.
 */

const mongoose = require('mongoose')
var http = require('http');
const app = require('./app')

/**
 * Detect Environment.
 */

const env = process.env.NODE_ENV || 'dev'

/**
 * Init DotEnv.
 */
if(env == 'dev') {
    require('dotenv').config()
}

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Connect to mongoDB server. 
 */

console.log('\x1b[36m%s\x1b[0m', 'Connecting To Mongodb....\n');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/todo-db-2', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('\x1b[92m%s\x1b[0m', 'Successfuly connected To Mongodb....\n');
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
}).catch(err => console.error('\x1b[91m%s\x1b[0m', err))

/**
 * Listen to server.
 */


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.log('\x1b[93m%s\x1b[0m', 'Listening on ' + bind + '\n');
}

