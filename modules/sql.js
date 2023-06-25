const dbconect = require("../db/datastores.json").datastore
const mysql = require('mysql2/promise');

async function executeSQLS(database, sql) {
  try {
    const selectedDB = dbconect.find(item => item.name === database);

    if (!selectedDB) {
      log("error", `El Conector "${database}" no es correcto o no existe`, "SQL");
      return { status: 0 };
    }

    const pool = mysql.createPool({
      connectionLimit: selectedDB.conn.connectionLimit,
      host: selectedDB.conn.server,
      user: selectedDB.conn.user,
      password: selectedDB.conn.password,
      database: selectedDB.conn.database,
      waitForConnections: true,
      queueLimit: 0
    });

    const [rows, fields] = await pool.execute(sql);

    await pool.end();

    return rows;
  } catch (error) {
    log("error", `Existe un error en la consulta :: ${error}`, "SQL");

    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      // Si la conexión se pierde, se vuelve a intentar una vez
      log("warning", `Se perdió la conexión con la base de datos. Reintentando la consulta...`, "SQL");
      return executeSQLS(database, sql);
    } else if (error.code === 'POOL_ENQUEUELIMIT') {
      // Si se alcanza el límite de la pool, se muestra una advertencia y se espera antes de reintentar
      log("warning", `Se alcanzó el límite de conexiones permitido. Esperando antes de reintentar...`, "SQL");
      await new Promise(resolve => setTimeout(resolve, 5000));
      return executeSQLS(database, sql);
    } else {
      // Cualquier otro error se maneja como una falla
      return { status: 0 };
    }
  }
}

async function executeSQL(database, sql, values) {
  try {
    const selectedDB = dbconect.find(item => item.name === database);

    if (!selectedDB) {
      log("error", `El Conector "${database}" no es correcto o no existe`, "SQL");
      return { status: 0 };
    }

    const pool = mysql.createPool({
      connectionLimit: selectedDB.conn.connectionLimit,
      host: selectedDB.conn.server,
      user: selectedDB.conn.user,
      password: selectedDB.conn.password,
      database: selectedDB.conn.database,
      waitForConnections: true,
      queueLimit: 0
    });

    const [rows, fields] = await pool.execute(sql, values);

    await pool.end();

    return rows;
  } catch (error) {
    log("error", `Existe un error en la consulta :: ${error}`, "SQL");

    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      // Si la conexión se pierde, se vuelve a intentar una vez
      log("warning", `Se perdió la conexión con la base de datos. Reintentando la consulta...`, "SQL");
      return executeSQLS(database, sql, values);
    } else if (error.code === 'POOL_ENQUEUELIMIT') {
      // Si se alcanza el límite de la pool, se muestra una advertencia y se espera antes de reintentar
      log("warning", `Se alcanzó el límite de conexiones permitido. Esperando antes de reintentar...`, "SQL");
      await new Promise(resolve => setTimeout(resolve, 5000));
      return executeSQLS(database, sql, values);
    } else {
      // Cualquier otro error se maneja como una falla
      return { status: 0 };
    }
  }
}


exports.executeSQLS = executeSQLS;

exports.executeSQL = executeSQL
