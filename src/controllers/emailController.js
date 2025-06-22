const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { geminiService } = require('../services/geminiService');
const { generateEmailPrompt, generateRewritePrompt } = require('../utils/prompt');
const {
  validateGenerateEmail,
  validateRewriteEmail,
  validateSaveEmail,
} = require('../services/validationService');
const logger = require('../utils/logger');

exports.userEmailHistory = async (req, res) => {
  const userId = req.user?.id;
  const { tone, page = 1, limit = 10 } = req.query;

  try {
    const filters = { userId };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    let whereClause;

    if (tone === 'other') {
      const availableTonesString = process.env.AVAILABLE_TONES || '';
      const availableTones = availableTonesString
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      whereClause = {
        ...filters,
        tone: {
          notIn: availableTones,
        },
      };
    } else if (tone) {
      whereClause = {
        ...filters,
        tone,
      };
    } else {
      whereClause = filters;
    }

    const [emails, totalCount] = await Promise.all([
      prisma.email.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.email.count({ where: whereClause }),
    ]);

    res.status(200).json({
      emails,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching filtered email history', error);
    res.status(500).json({ error: 'Something went wrong while fetching emails.' });
  }
};

exports.generateEmail = async (req, res) => {
  const validationError = validateGenerateEmail(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const { designation, tone, occasion, numberOfWords } = req.body;
  
    const prompt = generateEmailPrompt({ designation, tone, occasion, numberOfWords });
    const rawOutput = await geminiService(prompt);
  
    const subjectMatch = rawOutput.match(/Subject:\s*(.*)/i);
    const bodyMatch = rawOutput.match(/Body:\s*([\s\S]*?)Outro:/i);
    const outroMatch = rawOutput.match(/Outro:\s*([\s\S]*)/i);  
  
    return res.status(200).json({
      subject: subjectMatch?.[1]?.trim() || '',
      body: bodyMatch?.[1]?.trim() || '',
      outro: outroMatch?.[1]?.trim() || ''
    });
  }
   catch (error) {
    logger.error('Email generation error', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.rewriteEmail = async (req, res) => {
  const validationError = validateRewriteEmail(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const { originalEmail, tone, numberOfWords } = req.body;

    const prompt = generateRewritePrompt({ originalEmail, tone, numberOfWords });
    const rawOutput = await geminiService(prompt);

    const subjectMatch = rawOutput.match(/Subject:\s*(.*)/i);
    const bodyMatch = rawOutput.match(/Body:\s*([\s\S]*?)Outro:/i);
    const outroMatch = rawOutput.match(/Outro:\s*([\s\S]*)/i);  

    return res.status(200).json({
      subject: subjectMatch?.[1]?.trim() || '',
      body: bodyMatch?.[1]?.trim() || '',
      outro: outroMatch?.[1]?.trim() || ''
    });

  } catch (error) {
    logger.error('Email rewrite error', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.saveEmail = async (req, res) => {
  const validationError = validateSaveEmail(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const {
      originalEmail,
      rewrittenEmail,
      tone,
      recipientType,
      occasion,
      isGenerated = false, // ✅ Default to false if not provided
    } = req.body;

    const userId = req.user?.id;

    // ✅ Extra safety: validate rewrittenEmail structure
    if (
      typeof rewrittenEmail !== 'object' ||
      !rewrittenEmail.subject ||
      !rewrittenEmail.body ||
      !rewrittenEmail.outro
    ) {
      return res.status(400).json({ error: 'Invalid or incomplete rewrittenEmail object' });
    }

    const savedEmail = await prisma.email.create({
      data: {
        userId,
        originalEmail,
        rewrittenEmail,
        tone,
        recipientType,
        occasion,
        isGenerated, // ✅ Save to DB
      },
    });

    return res.status(201).json({
      message: 'Email saved successfully',
    });
  } catch (error) {
    logger.error('Error saving email', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


