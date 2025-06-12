const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { geminiService } = require('../services/geminiService')
const { generateEmailPrompt, generateRewritePrompt } = require('../utils/prompt');

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

exports.generateEmail = async (req, res) => {
    try {
      const { designation, tone, occasion } = req.body;
  
      if (!designation || !tone || !occasion) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const prompt = generateEmailPrompt({ designation, tone, occasion });
      const generatedEmail = await geminiService(prompt);
  
      return res.status(200).json({ email: generatedEmail });
    } catch (error) {
      console.error("Email generation error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  exports.rewriteEmail = async (req, res) => {
    try {
      const { originalEmail, tone } = req.body;
  
      if (!originalEmail || !tone) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const prompt = generateRewritePrompt({ originalEmail, tone });
      const rewrittenEmail = await geminiService(prompt);
  
      return res.status(200).json({ rewrittenEmail });
    } catch (error) {
      console.error("Email rewrite error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

exports.saveEmail = async (req, res) => {
    try {
        const {
            originalEmail, 
            rewrittenEmail,
            tone,
            recipientType,
            occasion
        } = req.body;

        const userId = req.user?.id;

        // Validation
        if (!originalEmail || !rewrittenEmail || !tone || !recipientType || !occasion) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const savedEmail = await prisma.email.create({
            data: {
                userId,
                originalEmail,
                rewrittenEmail,
                tone,
                recipientType,
                occasion
            }
        });

        return res.status(201).json({
            message: "Email saved successfully",
            email: savedEmail
        });

    } catch (error) {
        console.error("Error saving email:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
