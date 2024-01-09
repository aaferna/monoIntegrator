const { randomUUID } = require('crypto'); // Importa la función randomUUID

router.put("/management/token/regenerate/:tokenid", fun['userManagement'].authenticateToken, async (req, res) => {
  const { id, ip, uri, method } = trx(req);
  const { tokenid } = req.params; // Obtener el ID del token de los parámetros de la URL

  try {

    if (!req.user.permissions.adminUser || !req.user.permissions.createToken) {
      return res.status(401).json({ mensaje: 'No tiene el permiso para poder regenerar tokens' });
    }

    const client = modules['userManagement'].Client();

    // Verificar si el token que se va a regenerar pertenece al usuario autenticado
    const tokenARegenerar = await client.token.findUnique({
      where: {
        tokenid: parseInt(tokenid), // Convierte el tokenid a número
        userid: req.user.userid, // Verifica que el token pertenezca al usuario autenticado
      },
    });

    if (!tokenARegenerar) {
      return res.status(404).json({ mensaje: 'El token no fue encontrado o no pertenece al usuario autenticado.' });
    }

    // Regenerar el Bearer del token
    const nuevoBearer = randomUUID(); // Genera un nuevo Bearer

    // Actualizar el Bearer del token en la base de datos
    const tokenActualizado = await client.token.update({
      where: {
        tokenid: tokenARegenerar.tokenid, // ID del token a actualizar
      },
      data: {
        bearer: nuevoBearer, // Asigna el nuevo Bearer
      },
    });

    res.status(200).json({ mensaje: 'Bearer regenerado con éxito.', nuevoBearer });
  } catch (err) {
    log("error", `Existe un inconveniente - ${id} :: ${ip} :: ${uri} :: ${method} :: ${err}`, "userManagement");
    res.status(500).json({ msg: "Existe un inconveniente en la solicitud", id });
  }
});

module.exports = router;
