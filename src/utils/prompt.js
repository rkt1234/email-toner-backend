

exports.generateEmailPrompt = ({ designation, tone, occasion, numberOfWords = 100 }) => {
  return `
You are an AI assistant that generates professional, well-structured emails.

Instructions:
- Write **only one email** based on the details below:
  - Recipient: ${designation}
  - Occasion/Purpose: ${occasion}
  - Tone: ${tone}
  - Word Limit: approximately ${numberOfWords} words

Output Format (strictly follow):
Subject: <Concise subject line>
Body: <Main content of the email>
Outro: <Sign-off like Regards, etc.>

Additional Guidelines:
- The tone, formality, and length should match the context.
- Start with a suitable salutation (e.g., "Hi", "Hello", "Dear [Role]").
- Ensure the body is logically structured and polite.
- Use a proper sign-off and a placeholder for the sender’s name.
- Do **not** include commentary, multiple variations, or template labels — only the email as per the format.
`.trim();
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



