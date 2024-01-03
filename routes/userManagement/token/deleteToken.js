router.delete("/management/token/:tokenid", fun['userManagement'].authenticateSession, async (req, res) => {
    const { id, ip, uri, method } = trx(req);
    const { tokenid } = req.params; // Obtener el ID del token de los parámetros de la URL
  
    try {
      const client = modules['userManagement'].Client();
  
      // Verificar si el token que se va a eliminar pertenece al usuario autenticado
      const tokenAEliminar = await client.token.findUnique({
        where: {
          tokenid: parseInt(tokenid), // Convierte el tokenid a número
          userid: req.user.userid, // Verifica que el token pertenezca al usuario autenticado
        },
      });
  
      if (!tokenAEliminar) {
        return res.status(404).json({ mensaje: 'El token no fue encontrado o no pertenece al usuario autenticado.' });
      }
  
      // Eliminar el token
      await client.token.delete({
        where: {
          tokenid: tokenAEliminar.tokenid, // ID del token a eliminar
        },
      });
  
      res.status(200).json({ mensaje: 'Token eliminado con éxito.' });
    } catch (err) {
      log("error", `Existe un inconveniente - ${id} :: ${ip} :: ${uri} :: ${method} :: ${err}`, "userManagement");
      res.status(500).json({ msg: "Existe un inconveniente en la solicitud", id });
    }
  });
  
  module.exports = router;
  