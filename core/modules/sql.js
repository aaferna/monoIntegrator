const mysql = require('mysql');

exports.sql = (datastore, query, data = null) => {

    let connection = mysql.createConnection({
        host: datastore.server, 
        user: datastore.user, 
        password: datastore.password, 
        connectTimeout: datastore.connectTimeout, 
        database: datastore.database
    });
    
    return new Promise(function(resolve, reject) {
        connection.connect();

        if (data != null){

            connection.query(query, data, function (error, results, fields) {
                if (error) {
                    log4j.log("error", error);
                    reject(error)
                } else {
                    resolve(JSON.parse(JSON.stringify(results)))
                }
            });

        } else {

            connection.query(query, function (error, results, fields) {
                if (error) {
                    log4j.log("error", error);
                    reject(error)
                } else {
                    resolve(JSON.parse(JSON.stringify(results)))
                }
            });
        }

        connection.end();
    });

}

exports.limpiarCadena = (valor) => {

    valor   .replace("SELECT", ' ')
            .replace("COPY", ' ')
            .replace("DELETE", ' ')
            .replace("DROP", ' ')
            .replace("DUMP", ' ')
            .replace(" OR ", ' ')
            .replace("ALERT", ' ')
            .replace("INNER JOIN", ' ')
            .replace("WHERE", ' ')            
            .replace("%", ' ')
            .replace("\\", ' ');

}