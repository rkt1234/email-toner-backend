const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateSuggestTonePrompt } = require('../utils/prompt');
const { geminiService } = require('../services/geminiService')


const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // store securely in .env

exports.allTones = (req, res) => {
    try {
        const tonesString = process.env.AVAILABLE_TONES || "";
        const tones = tonesString.split(',').map(tone => tone.trim());

        return res.status(200).json({ tones });
    } catch (error) {
        console.error("Error fetching tones:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.suggestTone = async (req, res) => {
    try {
      const { recipient, occasion } = req.body;
  
      if (!recipient || !occasion) {
        return res.status(400).json({ error: "Recipient and occasion are required." });
      }
  
      const prompt = generateSuggestTonePrompt({ recipient, occasion });
  
      const suggestedTone = await geminiService(prompt); // Calls Gemini
  
      return res.status(200).json({ tone: suggestedTone.trim() });
    } catch (error) {
      console.error("Tone suggestion error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

