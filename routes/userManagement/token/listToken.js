router.get("/management/tokens/list/:userid?", fun['userManagement'].authenticateSession, async (req, res) => {
  const { id, ip, uri, method } = trx(req);
  const { userid } = req.query; // Obtener el userid de los parámetros de la URL

  // Si no se proporciona un userid en la URL, se usará el userid del req.user
  const userToUse = userid || req.user.userid;

  try {
    const client = modules['userManagement'].Client();

    // Buscar todos los tokens asociados al usuario autenticado o al userid proporcionado
    const tokensDelUsuario = await client.token.findMany({
      where: {
        userid: userToUse, // Usar el userid de la URL o del req.user
      },
    });

    res.status(200).json(tokensDelUsuario);
  } catch (err) {
    log("error", `Existe un inconveniente - ${id} :: ${ip} :: ${uri} :: ${method} :: ${err}`, "userManagement");
    res.status(500).json({ msg: "Existe un inconveniente en la solicitud", id });
  }
});

module.exports = router;
