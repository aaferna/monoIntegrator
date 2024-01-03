const prismaClient = require('./src/prisma/client').PrismaClient;
const jwt = require('jsonwebtoken');

const Client = () => {

    const logLevels = ['query', 'error', 'warn'];
    const clientName = 'User Management'
    const client = new prismaClient({
        log: logLevels.map(level => ({ emit: 'event', level })),
    });

    if (process.env.TRACE === 'true') {
        client.$on('query', e => {
            log('debug', `Params: ${e.params}\n\n${e.query}`, `Prisma ${clientName}`);

        });
    }

    logLevels.forEach(level => {
        if (level !== 'query') {
            client.$on(level, e => {
                log(level, `Params: ${e.params}\n\n${e.query}`, `Prisma ${clientName}`);
            });
        }
    });

    return client;
};

module.exports = { Client };