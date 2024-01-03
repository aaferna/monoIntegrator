const jwt = require('jsonwebtoken'); // Biblioteca para JWT

router.post('/management/users/registro', fun['userManagement'].authenticateSession, async (req, res) => {

    if (process.env.ENABLE_USERMANAGEMENT == 'true') {

        try {

            if (!req.user.permissions.createUsers) {
                return res.status(401).json({ mensaje: 'No tiene el permiso para poder crear usuarios' });
            }

            // Obtener los datos del cuerpo de la solicitud
            const { name, lastname, email, username, password, permissions } = req.body;
            const client = modules['userManagement'].Client()

            // Verificar si el correo o el nombre de usuario ya existen en la base de datos
            const usuarioExistente = await client.usuario.findFirst({
                where: {
                    OR: [
                        { email },
                        { username },
                    ],
                },
            });

            if (usuarioExistente) {
                return res.status(400).json({ mensaje: 'El correo o el nombre de usuario ya están en uso.' });
            }

            // Crear un nuevo usuario en la base de datos
            const nuevoUsuario = await client.usuario.create({
                data: {
                    name,
                    lastname,
                    email,
                    username,
                    password: jwt.sign(password, process.env.SYSTEMUSER_PASSWORDKEY),
                    permissions: JSON.stringify(permissions || {})
                },
            });

            res.status(201).json({ mensaje: 'Usuario creado con éxito', userid: nuevoUsuario.userid });

        } catch (error) {
            log('error', `Error al dar de alta usuario :: ${error}`, "userManagement");
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }

    } else {
        res.status(200).json({ mensaje: 'User Management no se encuentra habilitado' });
    }
    
});

module.exports = router;