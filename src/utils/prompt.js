

exports.generateEmailPrompt = ({ designation, tone, occasion }) => {
  return `
    You are an AI assistant that generates well-structured emails.
    
    Instructions:
    - Write **only one email** based on the following details:
      - Recipient: ${designation}
      - Occasion/Purpose: ${occasion}
      - Tone: ${tone}
    - The tone, formality, and length should align with the input context.
    - Start with an appropriate salutation (e.g., "Hi", "Hello", "Dear [Name/Role]") based on the tone and recipient.
    - Maintain coherence and structure in the email body.
    - End with a suitable closing (e.g., "Thanks", "Regards", "Best") and include a placeholder for the sender's name.
    - Do **not** include any explanations, variations, or extra commentary — just return one complete email.
    `;
};

exports.generateRewritePrompt = ({ originalEmail, tone, numberOfWords = 100 }) => {
  return `
Rewrite the following email in a ${tone} tone.
Limit the rewritten email to approximately ${numberOfWords} words.
Structure the output as follows:
Subject: <email subject>
Body: <main content of the email>
Outro: <sign-off, like Regards, Thanks, etc.>

Original Email:
"${originalEmail}"
  `.trim();
};


exports.generateSuggestTonePrompt = ({ recipient, occasion }) => {
  const availableTones = process.env.AVAILABLE_TONES || '';
  return `Suggest the most appropriate email tone for writing to a ${recipient} regarding ${occasion}. Only choose from the following tones: ${availableTones}. Just reply with the tone name.`;
};



