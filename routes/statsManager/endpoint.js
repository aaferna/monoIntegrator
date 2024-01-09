const { Client } = require('../../core/statsManager/main.js');
const prisma = Client();

router.get("/management/stats/endpoints", fun['userManagement'].authenticateSession, async (req, res) => {

    if (!req.user.permissions.adminUser) {
        return res.status(401).json({ mensaje: 'No tiene el permiso para poder crear usuarios' });
    }

    const { limit, offset, startDate, endDate } = req.query;

    const queryOptions = {
        take: limit ? parseInt(limit, 10) : undefined,
        skip: offset ? parseInt(offset, 10) : undefined,
        where: {},
    };

    // Filtrar por rango de fechas si se proporcionan
    if (startDate || endDate) {
        queryOptions.where.timestamp = {};
        if (startDate) {
            queryOptions.where.timestamp.gte = new Date(startDate);
        }
        if (endDate) {
            queryOptions.where.timestamp.lte = new Date(endDate);
        }
    }

    try {
        const logs = await prisma.accessLog.findMany(queryOptions);
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ message: "Error al recuperar los registros" });
    }

});

module.exports = router;
