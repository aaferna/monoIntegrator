const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/endpoint_stats.db');

// Crear tabla en la base de datos para almacenar la información
db.run("CREATE TABLE IF NOT EXISTS endpoint_stats (endpoint TEXT, date TEXT, count INTEGER)");

exports.endpointMiddleware = function (req, res, next) {

  const { id, ip, uri, method } = this.reqInfo(req)

  const endpoint = uri;
  const date = new Date().toISOString().substring(0, 10);

  // Buscar en la base de datos si ya se ha registrado la invocación de este endpoint para hoy
  db.get("SELECT * FROM endpoint_stats WHERE endpoint = ? AND date = ?", [endpoint, date], function (err, row) {
    if (err) {
      console.error(err);
      res.status(500).send("Error al acceder a la base de datos");
    } else if (row) {
      // Si ya se ha registrado, actualizar la cuenta
      db.run("UPDATE endpoint_stats SET count = count + 1 WHERE endpoint = ? AND date = ?", [endpoint, date], function (err) {
        if (err) {
          console.error(err);
          res.status(500).send("Error al acceder a la base de datos");
        } else {
          next();
        }
      });
    } else {
      // Si no se ha registrado, insertar una nueva entrada con cuenta 1
      db.run("INSERT INTO endpoint_stats (endpoint, date, count) VALUES (?, ?, 1)", [endpoint, date], function (err) {
        if (err) {
          console.error(err);
          res.status(500).send("Error al acceder a la base de datos");
        } else {
          next();
        }
      });
    }
  });
};

// Aplicar el middleware a todas las rutas
