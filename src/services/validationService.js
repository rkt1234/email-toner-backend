// src/services/validationService.js

exports.validateSignup = ({ name, email, password }) => {
    if (!name || !email || !password) {
        return 'Name, email, and password are required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Invalid email format.';
    }

    if (password.length < 6) {
        return 'Password must be at least 6 characters.';
    }

    return null; // valid
};

exports.validateSignin = ({ email, password }) => {
    if (!email || !password) {
        return 'Email and password are required.';
    }

    return null; // valid
};

// src/services/validationService.js

exports.validateGenerateEmail = ({ designation, tone, occasion }) => {
    if (!designation || !tone || !occasion) {
        return 'Designation, tone, and occasion are required.';
    }
    return null;
};

exports.validateRewriteEmail = ({ originalEmail, tone }) => {
    if (!originalEmail || !tone) {
        return 'Original email and tone are required.';
    }
    return null;
};

exports.validateSaveEmail = ({ originalEmail, rewrittenEmail, tone, recipientType, occasion }) => {
    if (!rewrittenEmail || !tone || !recipientType || !occasion) {
        return 'All fields are required to save the email.';
    }
    return null;
};

exports.validateSuggestTone = ({ recipient, occasion }) => {
    if (!recipient || !occasion) {
        return 'Recipient and occasion are required.';
    }

    if (recipient.length < 2 || occasion.length < 2) {
        return 'Recipient and occasion must be descriptive.';
    }

    return null;
};


