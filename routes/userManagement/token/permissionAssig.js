router.put("/management/token/permissions/:tokenid", fun['userManagement'].authenticateSession, async (req, res) => {
    const { id, ip, uri, method } = trx(req);
    const { tokenid } = req.params; // Obtener el ID del token de los parámetros de la URL
    const { permissions } = req.body; // Obtener las nuevas capacidades desde el cuerpo de la solicitud
  
    try {
      const client = modules['userManagement'].Client();
  
      // Verificar si el token que se va a actualizar pertenece al usuario autenticado
      const tokenAActualizar = await client.token.findUnique({
        where: {
          tokenid: parseInt(tokenid), // Convierte el tokenid a número
          userid: req.user.userid, // Verifica que el token pertenezca al usuario autenticado
        },
      });
  
      if (!tokenAActualizar) {
        return res.status(404).json({ mensaje: 'El token no fue encontrado o no pertenece al usuario registrado.' });
      }
  
      // Actualizar las capacidades (permissions) del token con el JSON proporcionado
      const tokenActualizado = await client.token.update({
        where: {
          tokenid: tokenAActualizar.tokenid, // ID del token a actualizar
        },
        data: {
          permissions: JSON.stringify(permissions), // Asigna el JSON proporcionado al campo permissions
        },
      });
  
      res.status(200).json(tokenActualizado ? {mensaje: 'Se asignaron los permisos al Token indicado'} : { mensaje: 'No se pudo asignar los permisos'});
      
    } catch (err) {
      log("error", `Existe un inconveniente - ${id} :: ${ip} :: ${uri} :: ${method} :: ${err}`, "userManagement");
      res.status(500).json({ msg: "Existe un inconveniente en la solicitud", id });
    }
  });
  module.exports = router;
  