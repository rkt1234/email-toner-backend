const { geminiService } = require('../services/geminiService');

exports.healthCheck = async (req, res) => {
  try {
    const status = await geminiService("How are you");
    return res.status(200).json({ status: 'healthy', message: 'Gemini API working fine' });
  } catch (err) {
    console.error('Health check error:', err);
    return res.status(500).json({ status: 'error', message: 'Health check failed' });
  }
};
