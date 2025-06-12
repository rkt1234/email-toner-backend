

exports.generateEmailPrompt = ({ designation, tone, occasion }) => {
    return `Write an email to a ${designation} with a ${tone} tone regarding ${occasion}.`;
  };
  
  exports.generateRewritePrompt = ({ originalEmail, tone }) => {
    return `Rewrite the following email in a ${tone} tone:\n\n"${originalEmail}"`;
  };
  