const mysql = require('mysql');

exports.sql = (dbconn, query = null, data = null) => {

    let dataconection = ""

        config.datastore.find(item => {
            if(item.name === dbconn){
                dataconection = item.conn
            }
        })

    let connection = mysql.createConnection({
        host: dataconection.server, 
        user: dataconection.user, 
        password: dataconection.password, 
        connectTimeout: dataconection.connectTimeout, 
        database: dataconection.database
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