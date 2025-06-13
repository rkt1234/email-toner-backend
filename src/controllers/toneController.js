const { PrismaClient } = require('@prisma/client');
const { generateSuggestTonePrompt } = require('../utils/prompt');
const { geminiService } = require('../services/geminiService');
const { validateSuggestTone } = require('../services/validationService');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

exports.allTones = (req, res) => {
  try {
    const tonesString = process.env.AVAILABLE_TONES || '';
    const tones = tonesString.split(',').map(tone => tone.trim()).filter(Boolean);

    return res.status(200).json({ tones });
  } catch (error) {
    logger.error('Error fetching tones:', error);
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
