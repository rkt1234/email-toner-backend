const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.userEmailHistory = async (req, res) => {
    const userId = req.user?.id;
    const { tone } = req.query;

    try {
        const filters = { userId };

        if (tone) {
            filters.tone = tone;
        }

        const emails = await prisma.email.findMany({
            where: filters,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                originalEmail: true,
                rewrittenEmail: true,
                tone: true,
                recipientType: true,
                occasion: true,
                createdAt: true
            }
        });

        res.status(200).json({ emails });
    } catch (error) {
        console.error('Error fetching filtered email history:', error);
        res.status(500).json({ error: 'Something went wrong while fetching emails.' });
    }
}