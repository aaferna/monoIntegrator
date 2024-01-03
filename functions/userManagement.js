const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
exports.authenticateSession = async (req, res, next) => {
  const { id, ip, uri, method } = trx(req);

  try {
    // Obtener el token Bearer del encabezado de autorización
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Acceso no autorizado. El token no se proporcionó.' });
    }

    // Verificar si el encabezado de autorización comienza con "Bearer "
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ mensaje: 'Acceso no autorizado. El token Bearer no se proporcionó.' });
    }

    // Verificar el token JWT
    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SYSTEMUSER_SESSIONKEY, async (err, user) => {
        if (err) {
          reject(err);
        } else {
          const client = modules['userManagement'].Client();
          const usuario = await client.usuario.findUnique({
            where: {
              token: user.token,
            },
          });
          resolve({ user: user, usuario: usuario });
        }
      });
    });

    if (!user.usuario) {
      res.status(401).json({ msg: "Existe alguin inconveniente con su session" });
    }

    req.user = user.user; // Almacenar la información del usuario en la solicitud (opcional)

    next(); // Continuar con la siguiente función de middleware
  } catch (error) {
    log("error", `Existe un inconveniente - ${id} :: ${ip} :: ${uri} :: ${method} :: ${error}`, "userManagement");
    res.status(500).json({ msg: "Existe un inconveniente en la solicitud", id });
  }
}

// Middleware para verificar el token JWT
exports.authenticateToken = async (req, res, next) => {
  const { id, ip, uri, method } = trx(req);

  try {
    // Obtener el token Bearer del encabezado de autorización
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Acceso no autorizado. El token no se proporcionó.' });
    }

    // Verificar si el encabezado de autorización comienza con "Bearer "
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ mensaje: 'Acceso no autorizado. El token Bearer no se proporcionó.' });
    }

    const client = modules['userManagement'].Client();
    const bearer = await client.token.findUnique({
      where: {
        bearer: token,
      },
    });


    if (!bearer) {
      res.status(401).json({ msg: "Existe alguin inconveniente con su session" });
    }

    req.bearer = {userid:bearer.userid, tokenid: bearer.tokenid, token: bearer.bearer, permissions: JSON.parse(bearer.permissions)}; // Almacenar la información del usuario en la solicitud (opcional)
    

    next(); // Continuar con la siguiente función de middleware
  } catch (error) {
    log("error", `Existe un inconveniente - ${id} :: ${ip} :: ${uri} :: ${method} :: ${error}`, "userManagement");
    res.status(500).json({ msg: "Existe un inconveniente en la solicitud", id });
  }
}