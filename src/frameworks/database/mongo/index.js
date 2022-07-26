const mongosee = require('mongoose');
const schemas = require('./schemas');

module.exports = {

    connect: () => {
        const db_conn_str = process.env.DB_CONNECTION_STRING;
        mongosee.connect(db_conn_str, { useNewUrlParser: true });

        const db = mongosee.connection;

        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log('Connected to MongoDB');
        });
    },
    schemas
}