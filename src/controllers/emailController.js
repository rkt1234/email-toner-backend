const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {geminiService} = require('../services/geminiService')

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
        });

        res.status(200).json({ emails });
    } catch (error) {
        console.error('Error fetching filtered email history:', error);
        res.status(500).json({ error: 'Something went wrong while fetching emails.' });
    }
}

exports.generateEmail = async (req,res) => {
    try {
        const { designation, tone, occasion } = req.body;
    
        if (!designation || !tone || !occasion) {
          return res.status(400).json({ error: "Missing required fields" });
        }
    
        const prompt = `Write an email to a ${designation} with a ${tone} tone regarding ${occasion}.`;
    
        const generatedEmail = await geminiService(prompt);
    
        return res.status(200).json({ email: generatedEmail });
      } catch (error) {
        console.error("Email generation error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
}