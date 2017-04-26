/**
 * Created by harekamsingh on 22/04/17.
 */
const Hapi = require('hapi');
const Path = require('path');
const Routes = require('./routes');
const mongoose = require('mongoose');
const {dbConfig} = require('./config');
const {MONGO_DB_URI} = dbConfig;
// Create a server with a host and port
let server = module.exports = new Hapi.Server();
server.connection({
    port: 3000,
    routes: {
        cors: true,
        files: {
            relativeTo: Path.join(__dirname, 'public')
        }
    }
});


server.register(require('./plugins'), function (err) {

    if (err) throw err;
    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './public'
    });
    server.route({
        method: "GET",
        path: "/css/{path*}",
        handler: {
            directory: {
                path: Path.join(__dirname, "public") + "/css",
                listing: true,
                index: false
            }
        }
    });
    server.route({
        method: "GET",
        path: "/fonts/{path*}",
        handler: {
            directory: {
                path: Path.join(__dirname, "public") + "/fonts",
                listing: true,
                index: false
            }
        }
    });
    server.route({
        method: "GET",
        path: "/images/{path*}",
        handler: {
            directory: {
                path: Path.join(__dirname, "public") + "/images",
                listing: true,
                index: false
            }
        }
    });
    server.route({
        method: "GET",
        path: "/js/{path*}",
        handler: {
            directory: {
                path: Path.join(__dirname, "public") + "/js",
                listing: true,
                index: false
            }
        }
    });
    server.route(Routes);
    //Connect to MongoDB
    mongoose.connect(MONGO_DB_URI, (err) => {
        if (err) {
            server.log("DB Error: ", err);
            process.exit(1);
        } else {
            server.log('MongoDB Connected at', MONGO_DB_URI);
        }
    });
    server.start(function () {
        console.log('Server started at port ' + server.info.port);
    });
});