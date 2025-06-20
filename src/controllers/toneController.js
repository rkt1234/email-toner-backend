const { PrismaClient } = require('@prisma/client');
const { generateSuggestTonePrompt } = require('../utils/prompt');
const { geminiService } = require('../services/geminiService');
const { validateSuggestTone } = require('../services/validationService');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

exports.getEmailMetadata = (req, res) => {
  try {
    const tones = (process.env.AVAILABLE_TONES || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const designations = (process.env.AVAILABLE_DESIGNATIONS || '')
      .split(',')
      .map(d => d.trim())
      .filter(Boolean);

    const occasions = (process.env.AVAILABLE_OCCASIONS || '')
      .split(',')
      .map(o => o.trim())
      .filter(Boolean);

    return res.status(200).json({
      tones,
      designations,
      occasions,
    });
  } catch (error) {
    logger.error('Error fetching tone/designation/occasion data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.suggestTone = async (req, res) => {
  const validationError = validateSuggestTone(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const { recipient, occasion } = req.body;
    const prompt = generateSuggestTonePrompt({ recipient, occasion });
    const suggestedTone = await geminiService(prompt);

    return res.status(200).json({ tone: suggestedTone.trim() });
  } catch (error) {
    logger.error('Tone suggestion error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
