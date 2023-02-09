const mysql = require("mysql2");
const mysqlSy = require('sync-mysql')
const dbconect = require("../db/datastores.json").datastore

function executeSQL(database, sql) {
  let dataconnection;
  const selectedDB = dbconect.find(item => item.name === database);

  if (selectedDB) {
    dataconnection = mysql.createConnection({
      host: selectedDB.conn.server,
      user: selectedDB.conn.user,
      password: selectedDB.conn.password,
      connectTimeout: selectedDB.conn.connectTimeout,
      database: selectedDB.conn.database,
      multipleStatements: true
    });
  } else {
    log("error", `El Conector "${database}" no es correcto o no existe`, "SQL");
    return Promise.resolve({ status: 0 });
  }

  return new Promise((resolve, reject) => {
    try {
      dataconnection.query(sql, (error, results) => {
        if (error) {
          log("error", `Existe un error en la consulta :: ${error}`, "SQL");
          resolve({ status: 0 });
        }
        resolve(results);
      });
    } catch (error) {
      log("error", `Existe un error en la consulta :: ${error}`, "SQL");
      resolve({ status: 0 });
    }
  });
}

function executeSQLS (database, sql) {
  try{

    let connection;
    let response;

    const selectedDB = dbconect.find(item => item.name === database);

    if (selectedDB) {

      connection = new mysqlSy({
        host: selectedDB.conn.server,
        user: selectedDB.conn.user,
        password: selectedDB.conn.password,
        connectTimeout: selectedDB.conn.connectTimeout,
        database: selectedDB.conn.database
      });

    } else {

      log("error", `El Conector "${database}" no es correcto o no existe`, "SQL");
      return { status: 0 };

    }

    response = connection.query(sql)
    connection.finishAll()

    return response;

  } catch (error) {
    log("error", `Existe un error en la consulta :: ${error}`, "SQL")
    return { status: 0 };
  }
}

module.exports = {
  executeSQL,
  executeSQLS
};