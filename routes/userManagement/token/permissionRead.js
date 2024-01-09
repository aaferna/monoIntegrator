router.get("/management/token/permissions/:tokenid", fun['userManagement'].authenticateSession, async (req, res) => {
    const { id, ip, uri, method } = trx(req);
    const { tokenid } = req.params; // Obtener el ID del token de los parámetros de la URL
  
    try {
      if (!req.user.permissions.adminUser || !req.user.permissions.viewToken) {
        return res.status(401).json({ mensaje: 'No tiene el permiso para poder asignar permisos a los tokens' });
      }

      const client = modules['userManagement'].Client();
  
      // Verificar si el token que se va a consultar pertenece al usuario autenticado
      const tokenAConsultar = await client.token.findUnique({
        where: {
          tokenid: parseInt(tokenid), // Convierte el tokenid a número
          userid: req.user.userid, // Verifica que el token pertenezca al usuario autenticado
        },
      });
  
      if (!tokenAConsultar) {
        return res.status(404).json({ mensaje: 'El token no fue encontrado o no pertenece al usuario autenticado.' });
      }
  
      // Obtener las capacidades (permissions) del token
      const permissionsDelToken = tokenAConsultar.permissions;
  
      res.status(200).json({ permissions: JSON.parse(permissionsDelToken) });
    } catch (err) {
      log("error", `Existe un inconveniente - ${id} :: ${ip} :: ${uri} :: ${method} :: ${err}`, "userManagement");
      res.status(500).json({ msg: "Existe un inconveniente en la solicitud", id });
    }
  });
  
  module.exports = router;