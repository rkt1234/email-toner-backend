

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

exports.generateRewritePrompt = ({ originalEmail, tone }) => {
    return `
  You are an AI assistant that rewrites emails.
  
  Instructions:
  - Rewrite the following email using a **${tone}** tone.
  - Preserve the original meaning, intent, and structure.
  - Adjust language, phrasing, and word choice to reflect the new tone.
  - Do **not** return multiple versions or add commentary — just return one revised email.
  
  Original Email:
  "${originalEmail}"
  `;
};

