require('dotenv').config();
const prismaModule = require('../main')
const client = prismaModule.Client()
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); 
global.log = require('../../../core/log4j').log;

function generatePassword() {
  const currentDate = new Date().toString();
  const md5Hash = crypto.createHash('md5').update(currentDate).digest('hex');
  return md5Hash;
}

const password = generatePassword();

client.usuario.create({
    data: {
        name: 'administrator',
        lastname: '',
        email: '',
        username: 'administrator',
        password: jwt.sign(password, process.env.SYSTEMUSER_PASSWORDKEY),
        permissions: JSON.stringify({ createUsers: true })
    },
}).then(r => {
    console.log(`\n\n\n\nSe creo la cuenta Admin de User Management \n\nNombre de Usuario: administrator\nContrase;a: ${password}\n\n\n\n`)
}).catch(e=>{
    console.log(e)
});