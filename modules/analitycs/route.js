const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/endpoint_stats.db');

router.get('/stats', function (req, res) {
    const startDate = req.query.startDate || datetoDay();
    const endDate = req.query.endDate || datetoDay();
  
    db.all(`SELECT * FROM endpoint_stats WHERE date BETWEEN '${startDate}' AND '${endDate}'`, function (err, rows) {

      if (err) {
        console.error(err);
        res.status(500).send("Error al acceder a la base de datos");
      } else {
        res.send(`
          <html>
            <head>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            </head>
            <body>
              <div class="container my-5">
                <h1 class="text-center">Estadísticas de Endpoints</h1>
                <form class="form-inline my-3">

                <div class="row">
                    <div class="col-md-6">
                        <label class="sr-only" for="startDate">Fecha Inicio</label>
                        <input type="date" class="form-control mr-2" id="startDate" name="startDate" value="${startDate}">
                    </div>
                    <div class="col-md-6">
                        <label class="sr-only" for="endDate">Fecha Fin</label>
                        <input type="date" class="form-control mr-2" id="endDate" name="endDate" value="${endDate}">
                    </div>
                    <div class="text-center col-md-12 py-3">
                        <button type="submit" class="btn btn-primary">Filtrar</button>
                    </div>
                </div>
                  
    
                  
    
                </form>
                <table class="table table-bordered">
                  <thead class="thead-dark">
                    <tr>
                      <th>Endpoint</th>
                      <th>Fecha</th>
                      <th>Cantidad de Invocaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rows.map(row => `
                      <tr>
                        <td>${row.endpoint}</td>
                        <td>${row.date}</td>
                        <td>${row.count}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </body>
          </html>
        `);
      }
    });
  });
  

module.exports = router