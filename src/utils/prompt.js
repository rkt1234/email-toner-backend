

exports.generateEmailPrompt = ({ designation, tone, occasion, numberOfWords = 100 }) => {
  return `
You are an AI assistant that generates professional, well-structured emails.

Instructions:
- Write **only one email** based on the details below:
  - Recipient: ${designation}
  - Occasion/Purpose: ${occasion}
  - Preferred Tone: ${tone}
  - Word Limit: approximately ${numberOfWords} words

Tone Rule:
- If the provided tone seems inappropriate for the recipient or occasion (e.g., unprofessional or too aggressive), then **silently adjust it** to a more contextually appropriate and respectful tone that preserves the user's intent. 
Follow the above strictly despite users input of tone use your own discretion to check whether the tone suits the occassion and recipient or not.
If not then choose the closest tone that would convey the message and maintain decency as well

Output Format (strictly follow):
Subject: <Concise subject line>
Body: <Main content of the email>
Outro: <Sign-off like Regards, etc.>

Important Constraints:
- None of the parts (subject, body, outro) should be empty or vague.
- Do not return placeholder values like "[Your Name]" — use meaningful, generic replacements if needed.
- Maintain tone, formality, and structure based on context.
- Do not include explanations, comments, or multiple versions — return only one complete email.
- Keep the total word count **under or as close as possible to ${numberOfWords} words**
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



