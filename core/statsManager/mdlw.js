const { Client } = require('./main');

const prisma = Client();

async function logAccess(req, res, next) {
  const { method, originalUrl } = req;


  if (originalUrl != '/management/stats/endpoints' && process.env.ENABLE_STATMANAGEMENT == 'TRUE') {

    // Obtener la IP del cliente
    let ip = req.ip;

    // Si estás detrás de un proxy, usa 'X-Forwarded-For' (XFF)
    if (req.headers['x-forwarded-for']) {
      ip = req.headers['x-forwarded-for'].split(',').shift();
    }

    try {
      await prisma.accessLog.create({
        data: {
          method,
          endpoint: originalUrl,
          ip, // Guardar la IP obtenida
        },
      });
    } catch (err) {
      console.error('Error al registrar el acceso:', err);
    }
  }

  next();
}

module.exports = logAccess;
