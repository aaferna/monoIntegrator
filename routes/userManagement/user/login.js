const jwt = require('jsonwebtoken'); // Biblioteca para JWT
const { randomUUID } = require('crypto');

// Ruta para el inicio de sesión
router.post('/management/users/login', async (req, res) => {

    if (process.env.ENABLE_USERMANAGEMENT == 'true') {

        try {
            let expire = { expiresIn: '365d' }
            // Obtener los datos del cuerpo de la solicitud
            const { username, password } = req.body;
            const client = modules['userManagement'].Client()

            // Buscar el usuario en la base de datos
            const usuario = await client.usuario.findUnique({
                where: {
                    username
                },
            });

            // Verificar si el usuario existe y si la contraseña es válida
            if (!usuario || jwt.verify(usuario.password, process.env.SYSTEMUSER_PASSWORDKEY) !== password) {
                return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
            }

            const tokenLink = randomUUID()

            if(process.env.SYSTEMUSER_EXPIRE == 'true'){
                if(process.env.SYSTEMUSER_EXPIRETIME){
                    expire = { expiresIn: process.env.SYSTEMUSER_EXPIRETIME}
                }
            }

            // Generar un token JWT para el usuario
            const token = jwt.sign(
                { userid: usuario.userid, name: usuario.name, lastname: usuario.lastname, token: tokenLink, permissions: JSON.parse(usuario.permissions) },
                process.env.SYSTEMUSER_SESSIONKEY, expire);

            await client.usuario.update({
                where: { userid: usuario.userid }, // ID del usuario existente
                data: { token: tokenLink }, // Actualiza el token JWT
            });

            // Devolver el token en la respuesta
            res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token });

        } catch (error) {
            log('error', `Error al iniciar sesión :: ${error}`, "userManagement");
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }

    } else {
        res.status(200).json({ mensaje: 'User Management no se encuentra habilitado' });
    }
    
});

module.exports = router;
