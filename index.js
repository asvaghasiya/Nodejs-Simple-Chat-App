process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    }).on('uncaughtException', err => {
        console.error('Uncaught Exception thrown', '\n', err);
    });

require("./modules")();

require('./connections/app')();

require('./connections/socket')();

server.listen(SERVER_PORT, function() {
    console.log("Server listening to the port ", SERVER_PORT, new Date());
});
